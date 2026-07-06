import express from "express";
import upload from "../middleware/multer.js";
import db from "../config/db.js";
import { products } from "../drizzle/schema.js";
import { deleteProduct } from "../controllers/product.controller.js";
import { addProduct } from "../controllers/product.controller.js";
import { getProductDetails } from "../controllers/product.controller.js";
import { getProducts } from "../controllers/product.controller.js";


const router=express.Router();

//addproduct route
router.post("/products",upload.single("image"),addProduct)

//product send to admin panel and frontend
router.get("/products",getProducts);

//delete the product
router.delete("/:id",deleteProduct);

//dynamic product details
router.get("/products/:id",getProductDetails)

export default router;