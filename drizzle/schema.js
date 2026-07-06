import { relations } from "drizzle-orm";
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
    id:int('id').autoincrement().primaryKey(),
    name:varchar("name",{length:255 }).notNull(),
    email:varchar('email',{length:255}).notNull().unique(),
    password:text('password').notNull(),
    role:varchar("role",{length:50}).default("user"),
    createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt:timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt:timestamp('deleted_at'),
});

export const sessions=mysqlTable("sessions",{
    id:varchar('id',{length:255}).primaryKey(),
    userId:int('user_id').notNull().references(()=>usersTable.id,{onDelete:'cascade'}),
    userAgent:varchar("useragent",{length:255}).notNull(),
    ip:varchar('ip',{length:255}).notNull(),
    expiresAt:timestamp('expires_at').notNull(),
    createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt:timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const products=mysqlTable("product",{
  id:int('id').autoincrement().primaryKey(),
  productName:varchar("productname",{length:255}).notNull(),
  SKU:varchar("SKU",{length:255}).notNull(),
  category:mysqlEnum('category',[
    "Clothing",
    "Mobile",
    "Shoes",
  ]).notNull(),
  image:varchar('image',{length:255}).notNull(),
  discount: int("discount").notNull().default(0),       
  price:int('price').notNull(),
  stock:int('stock').notNull(),
  status:mysqlEnum('status',[
    "in-stock",
    "low-stock",
    "out-of-stock",
  ]).notNull(),
})

export const cart=mysqlTable("cart",{
  id:int('id').autoincrement().primaryKey(),
  userId:int('user_id').notNull().references(()=>usersTable.id,{onDelete:'cascade'}),
  productId:int('product_id').notNull().references(()=>products.id,{onDelete:'cascade'}),
  quantity:int("quantity").notNull().default(1),
  createdAt:timestamp('created_at').defaultNow().notNull(),
})

export const shippingAddress = mysqlTable("shipping_address", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),

  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  totalAmount: int("total_amount").notNull(),

  paymentMethod: varchar("payment_method", {
    length: 50,
  }).notNull(),

  status: varchar("status", {
    length: 50,
  })
    .notNull()
    .default("Pending"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),

  orderId: int("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),

  productId: int("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),

  quantity: int("quantity").notNull(),

  price: int("price").notNull(),

  discount: int("discount")
    .notNull()
    .default(0),
});

//sessionRelations
export const usersRelation=relations(usersTable,({one,many})=>({
  //One user can have many sessions.
  carts: many(cart),
  sessions:many(sessions),
  orders: many(orders),
}))

export const sessionRelations=relations(sessions,({one})=>({
  //Each session belongs to one user
  user:one(usersTable,{
    fields:[sessions.userId],
    references:[usersTable.id],
  })
}))

//cart relations
export const cartRelation=relations(cart,({one})=>({
//one cart belongs to one user
user:one(usersTable,{
  fields:[cart.userId],
  references:[usersTable.id],
}),

//cart belongs to one product
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}));

export const AddressRelation=relations(shippingAddress,({one})=>({
//one shippingadrress belongs to one user
user:one(usersTable,{
  fields:[shippingAddress.userId],
  references:[usersTable.id],
}),
}));

//order relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [orders.userId],
    references: [usersTable.id],
  }),

  items: many(orderItems),
}));

//order items
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),

  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

//product relations
export const productsRelations = relations(products, ({ many }) => ({
  cart: many(cart),

  orderItems: many(orderItems),
}));