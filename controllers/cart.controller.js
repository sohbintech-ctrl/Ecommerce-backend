import { and, eq } from "drizzle-orm";
import db from "../config/db.js";
import {  cart, products } from "../drizzle/schema.js";

export const addCart=async(req,res)=>{
    try {
    const userId = req.userId; 
    const { productId } = req.body;

    // 1. check if product already exists in cart
    const existing = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.userId, userId),
          eq(cart.productId, productId)
        )
      );

    // 2. if already exists → quantity + 1
    if (existing.length > 0) {
      await db
        .update(cart)
        .set({
          quantity: existing[0].quantity + 1,
        })
        .where(
          and(
            eq(cart.userId, userId),
            eq(cart.productId, productId)
          )
        );

      return res.json({
        success: true,
        message: "Cart updated (quantity +1)",
      });
    }

    // 3. if not exists - insert new row
    await db.insert(cart).values({
      userId,
      productId,
      quantity: 1,
    });

    return res.json({
      success: true,
      message: "Added to cart",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

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

    return res.json({
      success: true,
      cart: cartItems,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteCart=async(req,res)=>{
  const{id}=req.params;
  //console.log(id);
  await db.delete(cart).where(eq(cart.id,Number(id)));

  return res.json({
    success:true,
    message:"delete successfully",
  })
}

export const increaseQuantity=async(req,res)=>{
  const{id}=req.params;

  const existing=await db.select().from(cart).where(eq(cart.id,Number(id)));

  const productData=await db.select().from(products).where(eq(products.id,existing[0].productId));

  if(productData[0].stock<=existing[0].quantity){
    return res.json({
      success:false,
      message:"out of stock",
    })
  }

  try{
     await db.update(cart).set({
     quantity:existing[0].quantity+1,
     })
     .where(eq(cart.id,Number(id)));

     return res.json({
      success:true,
      message:"Quantity Updated",
     })
  }catch(err){
    console.log(err);

    return res.status(500).json({
      success:false,
      message:"Server Error",
    })
  }



}

export const decreaseQuantity=async(req,res)=>{
  const{id}=req.params;

  const existing=await db.select().from(cart).where(eq(cart.id,Number(id)));

  if(existing[0].quantity==1){
    await db.delete(cart).where(eq(cart.id,Number(id)));

     return res.json({
    success:true,
    message:"delete successfully",
  })
  }
   

  try{
     await db.update(cart).set({
      quantity:existing[0].quantity-1,
     }).where(eq(cart.id,Number(id)));
    

     return res.json({
      success:true,
      message:"Quantity Updated",
     })


  }catch(error){
    console.log(error);
    
    return res.status(500).json({
      success:false,
      message:"Server Error",
    })
  }
}