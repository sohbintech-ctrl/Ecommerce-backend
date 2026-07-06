import express from "express";
import { addRegister, checkLogin, getProfile, Logout, updateProfile } from "../controllers/auth.controller.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";


const router = express.Router();

//Register Route
router.post("/register", addRegister);

// LOGIN ROUTE
router.post("/login", checkLogin);

//logout route
router.post("/logout",Logout);

//profile get from middleware after verify and return to frontend.
router.get("/profile", authMiddleWare, getProfile)

//profile get updated again and send to frontend
router.put("/profile",authMiddleWare,updateProfile)

export default router;