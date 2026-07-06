import { eq } from "drizzle-orm";
import db from "../config/db.js";
import { shippingAddress } from "../drizzle/schema.js";

export const addShippingAddress=async(req,res)=>{
    const{fullName,phone, province, district, city, streetAddress,}=req.body;
    const userId = req.userId;

    //console.log(userId);
 await db.insert(shippingAddress).values({
  userId,
  fullName,
  phone,
  province,
  district,
  city,
  address:streetAddress,
  });

    return res.json({
    
    success: true,
    message: "Saved Successfully",
  })
}


export const getShippingAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const address = await db
      .select()
      .from(shippingAddress)
      .where(eq(shippingAddress.userId, userId));

    return res.json({
      success: true,
      address,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateShippingAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      fullName,
      phone,
      province,
      district,
      city,
      streetAddress,
    } = req.body;

    await db
      .update(shippingAddress)
      .set({
        fullName,
        phone,
        province,
        district,
        city,
        address: streetAddress, 
      })
      .where(eq(shippingAddress.userId, userId));

    return res.json({
      success: true,
      message: "Shipping address updated successfully",
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};