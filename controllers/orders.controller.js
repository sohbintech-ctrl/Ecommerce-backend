import { eq } from "drizzle-orm";
import { cart, orderItems, orders, products, shippingAddress, usersTable } from "../drizzle/schema.js";
import db from "../config/db.js";



export const addOrders=async(req,res)=>{
    const userId = req.userId;
    try{
        const cartItems = await db
      .select({
        cartId: cart.id,
        quantity: cart.quantity,

        productId: products.id,
        productName: products.productName,
        image: products.image,
        price: products.price,
        discount: products.discount,
        stock: products.stock,
        status: products.status,
      })
      .from(cart)
      .innerJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId));
   
     // console.log(cartItems);

     if (cartItems.length === 0) {
     return res.json({
    success: false,
    message: "Cart is empty",
     });
    }

    const subtotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const totalDiscount = cartItems.reduce(
  (sum, item) =>
    sum + (item.price * item.quantity * item.discount) / 100,
  0
);

const grandTotal = subtotal - totalDiscount;

    
const newOrder = await db
  .insert(orders)
  .values({
    userId,
    totalAmount: grandTotal,
    paymentMethod: "COD",
    status: "Pending",
  })
  .$returningId();

  const orderId=newOrder[0].id;

for (const item of cartItems) {
  await db.insert(orderItems).values({
    orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    discount: item.discount,
  });
}

for (const item of cartItems) {
  await db
    .update(products)
    .set({
      stock: item.stock - item.quantity,
    })
    .where(eq(products.id, item.productId));
}

await db.delete(cart).where(eq(cart.userId, userId));

return res.json({
  success: true,
  message: "Order placed successfully",
});

    }catch(err){
        console.log(err);
    }
}

//specific order by user id only.
export const getOrders=async(req,res)=>{
  const userId=req.userId;

  try{
   const userOrders = await db
  .select({
    orderId: orders.id,
    totalAmount: orders.totalAmount,
    paymentMethod: orders.paymentMethod,
    status: orders.status,
    createdAt: orders.createdAt,

    productId: products.id,
    productName: products.productName,
    image: products.image,

    quantity: orderItems.quantity,
    price: orderItems.price,
    discount: orderItems.discount,
  })
  .from(orders)
  .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
  .innerJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orders.userId, userId));

  if (userOrders.length === 0) {
  return res.json({
    success: true,
    orders: [],
    message:"Orders has not done yet",
  });
}

return res.json({
  success: true,
  orders: userOrders,
});


  }catch(err){
    console.log(err);

     return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
  }
}

//admin getallorders
export const getAllOrders = async (req, res) => {
  try {
    const rows = await db
      .select({
        orderId: orders.id,
        totalAmount: orders.totalAmount,
        paymentMethod: orders.paymentMethod,
        status: orders.status,
        createdAt: orders.createdAt,

        // User
        name: usersTable.name,

        // Shipping
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        province: shippingAddress.province,
        district: shippingAddress.district,
        city: shippingAddress.city,
        address: shippingAddress.address,

        // Product
        productId: products.id,
        productName: products.productName,
        image: products.image,
        quantity: orderItems.quantity,
        price: orderItems.price,
        discount: orderItems.discount,
      })
      .from(orders)
      .innerJoin(usersTable, eq(orders.userId, usersTable.id))
      .innerJoin(shippingAddress, eq(orders.userId, shippingAddress.userId))
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id));

    // making a group of one order id different products.
    const grouped = {};

    for (const row of rows) {
      if (!grouped[row.orderId]) {
        grouped[row.orderId] = {
          orderId: row.orderId,
          totalAmount: row.totalAmount,
          paymentMethod: row.paymentMethod,
          status: row.status,
          createdAt: row.createdAt,

          name: row.name,

          shippingAddress: {
            fullName: row.fullName,
            phone: row.phone,
            province: row.province,
            district: row.district,
            city: row.city,
            address: row.address,
          },

          products: [],
        };
      }

      grouped[row.orderId].products.push({
        productId: row.productId,
        productName: row.productName,
        image: row.image,
        quantity: row.quantity,
        price: row.price,
        discount: row.discount,
      });
    }

    return res.json({
      success: true,
      orders: Object.values(grouped),
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
//update Order Status
export const updateOrderStatus=async(req,res)=>{
const orderId = Number(req.params.id);
const { status } = req.body;

  try {
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));

    return res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}