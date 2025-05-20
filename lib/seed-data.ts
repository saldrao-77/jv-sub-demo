"use server"

export async function seedDatabase() {
  // We don't need this function anymore since we're using SQL to seed the database
  return { success: true, message: "Database already seeded via SQL" }
}
