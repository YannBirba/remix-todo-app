import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Await, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { db } from "db";
import { todoLists, todos } from "db/schema";
import { deferIf } from "defer-if";
import { eq } from "drizzle-orm";
import { Suspense, useEffect } from "react";
import { Button } from "react-aria-components";
import { css } from "styled-system/css";
import { Form } from "~/components/Form";
import { Icon } from "~/components/Icon";
import { Todo } from "~/components/Todo";
import { emitter } from "~/helpers/emitter.server";
import { isMobileUserAgent } from "~/helpers/isMobileUserAgent";
import { generateMeta } from "~/helpers/meta";
import { useLiveLoader } from "~/helpers/useLiveLoader";
import { getTodolist } from "~/loaders/getTodolist";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!user) return redirect("/login");

  if (!params.id) return redirect("/404");
  const id = parseInt(params.id) ?? redirect("/404");
  const data = {
    todoList: getTodolist(user.id, id),
  };
  return deferIf(data, isMobileUserAgent(request));
};

export const meta: MetaFunction<typeof loader> = () => {
  return generateMeta({
    description: `Todolist`,
    title: "TODO",
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const data = await request.formData();
  const action = data.get("action");

  if (!action) return redirect("/404");

  if (action === "delete") {
    const idData = data.get("id");

    if (!idData) return redirect("/404");

    const id = parseInt(idData.toString());

    if (!id) return redirect("/404");

    try {
      await db.delete(todos).where(eq(todos.id, id));
      emitter.emit(params.id!);
      return redirect(`/${params.id}`);
    } catch (error) {
      // @ts-ignore
      throw new Error(error.message);
    }
  }

  if (action === "create") {
    const todoListIdParam = params.id;
    if (!todoListIdParam) return redirect("/404");
    const todoListId = parseInt(todoListIdParam) ?? redirect("/404");

    try {
      await db.insert(todos).values({ name: "", todoListId });
      emitter.emit(params.id!);
      return redirect(`/${params.id}`);
    } catch (error) {
      // @ts-ignore
      throw new Error(error.message);
    }
  }

  if (action === "update") {
    const idData = data.get("id");
    const nameData = data.get(`todo-name-${idData}`);
    const completedData = data.get(`todo-completed-${idData}`);

    if (!idData || nameData === null) return redirect("/404");

    const id = parseInt(idData.toString());
    const name = nameData.toString();
    const completed = completedData?.toString() === "on";

    if (!id) return redirect("/404");

    try {
      await db.update(todos).set({ name, completed }).where(eq(todos.id, id));
      emitter.emit(params.id!);
      return redirect(`/${params.id}`);
    } catch (error) {
      // @ts-ignore
      throw new Error(error.message);
    }
  }

  if (action === "delete-todolist") {
    const idData = data.get("id");

    if (!idData) return redirect("/404");

    const id = parseInt(idData.toString());

    if (!id) return redirect("/404");

    try {
      await db.delete(todos).where(eq(todos.todoListId, id));
      await db.delete(todoLists).where(eq(todoLists.id, id));
      emitter.emit("new-todo");
      return redirect(`/`);
    } catch (error) {
      // @ts-ignore
      throw new Error(error.message);
    }
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div />;
  }
  return <div />;
}

const TodoList = () => {
  const { todoList } = useLiveLoader<typeof loader>();

  useEffect(() => {
    const todoInputs = document.querySelectorAll(
      "input[type=text][name^=todo-name-]"
    );

    if (!todoInputs.length) return;

    const todoInput = todoInputs[todoInputs.length - 1] as HTMLInputElement;

    if (todoInput.value === "") todoInput.focus();
  }, [todoList]);

  return (
    <Suspense fallback="Loading ...">
      <Await resolve={todoList}>
        {(value) => (
          <>
            <h1>{value.title}</h1>
            <ul>
              {value &&
                value.todos.length > 0 &&
                value.todos.map((todo) => (
                  <li key={todo.id}>
                    <Todo {...todo} />
                  </li>
                ))}
            </ul>
            <div
              className={css({
                display: "flex",
                gap: "2",
              })}
            >
              <Form method="post">
                <input type="hidden" name="action" value="create" />
                <Button type="submit">
                  <Icon name="Plus" />
                </Button>
              </Form>
              <Form method="post">
                <input type="hidden" name="action" value="delete-todolist" />
                <input type="hidden" name="id" value={value.id} />
                <Button type="submit">
                  <Icon name="Trash2" />
                </Button>
              </Form>
            </div>
          </>
        )}
      </Await>
    </Suspense>
  );
};

export { TodoList as default };
