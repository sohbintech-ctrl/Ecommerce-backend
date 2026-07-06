import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { addCart, decreaseQuantity, deleteCart, getCart, increaseQuantity } from "../controllers/cart.controller.js";

const router=express.Router();

router.post("/addcart",authMiddleWare ,addCart);

router.get("/", authMiddleWare, getCart);

router.delete("/:id", authMiddleWare,deleteCart);

router.put("/increase/:id",authMiddleWare,increaseQuantity);

router.put("/decrease/:id",authMiddleWare,decreaseQuantity);

export default router;