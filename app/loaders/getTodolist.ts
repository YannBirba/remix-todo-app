import { db } from "db";
import { todoLists } from "db/schema";
import { and, eq } from "drizzle-orm";

export const getTodolist = async (id: number) => {
  const data = await db.query.todoLists.findFirst({
    where: and(eq(todoLists.userId, 1), eq(todoLists.id, id)),
    with: {
      todos: true,
    },
  });
  return data;
};
