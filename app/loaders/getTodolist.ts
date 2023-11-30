import { db } from "db";
import { todoLists } from "db/schema";
import { and, eq } from "drizzle-orm";

export const getTodolist = async (userId: number, id: number) => {
  const data = await db.query.todoLists.findFirst({
    where: and(eq(todoLists.userId, userId), eq(todoLists.id, id)),
    with: {
      todos: {
        columns: {
          id: true,
          name: true,
          completed: true,
        },
      },
      owner: {
        columns: {
          id: true,
          name: true,
        },
      },
      users: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return data;
};
