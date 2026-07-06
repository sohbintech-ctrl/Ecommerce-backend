import db from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";

export const getCustomers = async (req, res) => {
  try {

  const customers = await db
  .select({
    id: usersTable.id,
    fullName: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
  })
  .from(usersTable);


  return res.json({
  success: true,
  customers,
});


  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};