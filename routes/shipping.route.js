import express from "express";
import { addShippingAddress, getShippingAddress, updateShippingAddress } from "../controllers/shipping.controller.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/addshipping",authMiddleWare,addShippingAddress);

router.get("/", authMiddleWare, getShippingAddress);

router.put("/updateaddress", authMiddleWare, updateShippingAddress);

export default router;