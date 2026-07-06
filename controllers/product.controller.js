import db from "../config/db.js";
import { products } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";


// Add Product
export const addProduct = async (req, res) => {
  try {
    const { product, SKU, category, stock, price, discount } = req.body;

    const image = req.file ? req.file.filename : null;

    const stockNumber = Number(stock);

    let status = "";

    if (stockNumber === 0) {
      status = "out-of-stock";
    } else if (stockNumber <= 10) {
      status = "low-stock";
    } else {
      status = "in-stock";
    }

    await db.insert(products).values({
      productName: product,
      SKU,
      category,
      stock: stockNumber,
      price: Number(price),
      discount: Number(discount),
      image,
      status,
    });

    return res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const allProducts = await db.select().from(products);

    return res.json({
      success: true,
      product: allProducts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Single Product
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)));

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)));

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  
   const imagePath = path.join(
   process.cwd(),
  "uploads",
  existingProduct[0].image
);

 // console.log(imagePath);

 try {
  await fs.unlink(imagePath);
  //console.log("Image deleted successfully");
} catch (err) {
  console.log("Image delete error:", err);
}

await db.delete(products).where(eq(products.id, Number(id)));

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};