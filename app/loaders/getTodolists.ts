import { db } from "db";
import { todoLists } from "db/schema";
import { desc, eq } from "drizzle-orm";

export const getTodolists = async (userId: number) => {
  const data = await db.query.todoLists.findMany({
    where: eq(todoLists.userId, userId),
    columns: { title: true, id: true },
    orderBy: [desc(todoLists.createdAt)],
  });
  return data;
};
