import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { addOrders, getAllOrders, getOrders, updateOrderStatus } from "../controllers/orders.controller.js";

const router=express.Router();

router.post("/",authMiddleWare,addOrders);

router.get("/",authMiddleWare,getOrders);

//admin order get
router.get("/admin",getAllOrders);

router.put("/admin/:id",updateOrderStatus);

export default router;