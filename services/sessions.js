import { sessions } from "../drizzle/schema.js";
import crypto from "crypto";
import db from "../config/db.js";

//create session
export const createSession=async(user,req)=>{
    //generate token
    const token=crypto.randomBytes(32).toString("hex");

    //hashed the token
    const hashedToken=crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    //insert session into DB
    await db.insert(sessions).values({
        id:hashedToken,
        userId:user.id,
        ip:req.ip,
        userAgent:req.headers["user-agent"] || "",
        expiresAt:new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    });

    //return token to use on cookie
    return token;
}