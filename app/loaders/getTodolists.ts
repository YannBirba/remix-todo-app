import { db } from "db";
import { todoLists } from "db/schema";
import { desc, eq } from "drizzle-orm";

export const getTodolists = async () => {
  const data = await db.query.todoLists.findMany({
    where: eq(todoLists.userId, 1),
    columns: { title: true, id: true },
    orderBy: [desc(todoLists.createdAt)],
  });
  return data;
};
