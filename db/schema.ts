import { relations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique("email"),
    password: text("password").notNull(),
    createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
    updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
  },
  (users) => ({
    passwordIndex: index("password_index").on(users.password),
  })
);

export const todoLists = sqliteTable("todo_lists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

export const usersTodoLists = sqliteTable(
  "users_todo_lists",
  {
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    todoListId: integer("todo_list_id")
      .references(() => todoLists.id)
      .notNull(),
    createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
    updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
  },
  (usersTodoLists) => ({
    userTodoListPrimaryKey: primaryKey({
      columns: [usersTodoLists.userId, usersTodoLists.todoListId],
    }),
  })
);

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
  todoListId: integer("todo_list_id")
    .references(() => todoLists.id)
    .notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// relationships

export const usersRelations = relations(users, ({ many }) => ({
  todoLists: many(todoLists),
}));

export const todoListsRelations = relations(todoLists, ({ many, one }) => ({
  users: many(users),
  todos: many(todos),
  user: one(users, {
    fields: [todoLists.userId],
    references: [users.id],
  }),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  todoList: one(todoLists, {
    fields: [todos.todoListId],
    references: [todoLists.id],
  }),
}));

// infer types

export type User = typeof users.$inferSelect;
export type TodoList = typeof todoLists.$inferSelect;
export type Todo = typeof todos.$inferSelect;
