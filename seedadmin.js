import db from "./config/db.js";
import { usersTable } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

const email = "sohbintech@gmail.com"; // आफ्नो admin email

async function makeAdmin() {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (user.length === 0) {
    console.log("User not found");
    process.exit(0);
  }

  await db
    .update(usersTable)
    .set({ role: "admin" })
    .where(eq(usersTable.email, email));

  console.log(`${email} is now an admin.`);
  process.exit(0);
}

makeAdmin();