import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

//cookie can read by backend
app.use(cors({
  origin:
  [
   "http://localhost:3000",
   "http://192.168.18.67:3000",
    process.env.CLIENT_URL,
  ] ,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// import routes

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import shippingRoutes from "./routes/shipping.route.js";
import ordersRoutes from "./routes/orders.routes.js";
import customersRoutes from "./routes/customers.routes.js";

// use routes
app.use("/api/auth", authRoutes);
app.use("/api/product",productRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/cart",cartRoutes);
app.use("/api/shipping",shippingRoutes);
app.use("/api/orders",ordersRoutes);
app.use("/api/customers",customersRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);  
});