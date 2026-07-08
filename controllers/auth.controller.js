
import db from "../config/db.js";
import { products, sessions, usersTable} from "../drizzle/schema.js";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { createSession } from "../services/sessions.js";
import crypto from "crypto";


//addregister to database and check validation
export const addRegister=async(req,res)=>{
     try {
    const { name, email, password } = req.body; 

    // validation of all fields required 
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

     //check duplicate user
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    // hash password
    const hashedPassword = await argon2.hash(password);

    //insert user
    await db.insert(usersTable).values({
      name,
      email,
      password: hashedPassword,
    });

    return res.json({
      success: true,
      message: "Registration successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
}

//checklogin and verify
export const checkLogin=async(req,res)=>{
    const { email, password } = req.body;
  //console.log(email, password);
  
  //verify email
  const existingEmail=await db.select().from(usersTable).where(eq(usersTable.email,email));

  if(existingEmail.length==0){
   return res.json({
    success:false,
    message:"Invalid Email and password",
   })
  }

   const user=existingEmail[0]

  //verify password
  const isValidPassword=await argon2.verify(
    user.password,
    password
  )

  if(!isValidPassword){
    return res.json({
   success:false,
   message:"Invalid Email and password"
    });
  };

  //success
 const token=await createSession(user,req)

res.cookie("session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24,
});
  
  return res.json({
    success:true,
    message: "Login Successfully",
    user: {
       success:true,
       id:user.id,
       name:user.name,
       email:user.email,
       role:user.role,
    }
  });
};

//logout
export const Logout=async(req,res)=>{
     const token=req.cookies.session;

     if (!token) {
      return res.status(400).json({
        message: "No session found",
      });
    }

 const hashedtoken= crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    await db.delete(sessions).where(eq(sessions.id,hashedtoken));

    res.clearCookie("session");

    res.json({
      success:true,
      message:"Logout"
    })
}

//getprofile from session
export const getProfile=async(req,res)=>{
     try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId));

    return res.json({
      success: true,
      user: user[0],
    
    });

  } catch (err) {
    console.log("PROFILE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

//put or update profile
export const updateProfile=async(req,res)=>{
  const{name,email}=req.body;

  await db.update(usersTable).set({name,email}).where(eq(usersTable.id,req.userId));

  const updatedUser=await db.select().from(usersTable).where(eq(usersTable.id,req.userId));

  return res.json({
    success:true,
    user:updatedUser[0],
    message:"Profile Updated",
  })
}



