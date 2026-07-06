import { sessions } from "../drizzle/schema.js";
import db from "../config/db.js";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const authMiddleWare = async (req, res, next) => {
  try {
    // token from cookie
    const token = req.cookies.session;

    // check token first
    if (!token) {
      return res.status(401).json({
        message: "No session found",
      });
    }

    // hash token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // check session in DB
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, hashedToken));

    if (session.length === 0) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }
    
    // receive userId
    req.userId = session[0].userId;
    next();
  } catch (error) {
    console.log("Auth error:", error);

    return res.status(500).json({
      message: "Auth error",
    });
  }
};