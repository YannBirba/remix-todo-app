import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { db } from "db";
import { todoLists } from "db/schema";
import { Button } from "react-aria-components";
import { Form } from "~/components/Form";
import { TextField } from "~/components/TextField";
import { emitter } from "~/helpers/emitter.server";
import { generateMeta } from "~/helpers/meta";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export const meta: MetaFunction<typeof loader> = ({}) => {
  return generateMeta({
    description: "Ajouter une todolist",
    title: "Ajouter une todolist",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!user) return redirect("/login");

  const data = await request.formData();
  const titleData = data.get("title");

  if (!titleData) throw new Error("Missing data");

  const title = titleData.toString();

  if (!title) throw new Error("Incorrect data");

  try {
    const { lastInsertRowid } = await db
      .insert(todoLists)
      .values({ title, userId: user.id });
    emitter.emit("new-todo");
    return redirect(`/${lastInsertRowid}`);
  } catch (error) {
    // @ts-ignore
    throw new Error(error.message);
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div />;
  }
  return <div />;
}

const NewTodoList = () => {
  return (
    <>
      <h1>Ajouter une todolist</h1>
      <Form method="post">
        <TextField
          label="Titre"
          name="title"
          autoFocus
          autoComplete="todolist-title"
          isRequired
        />
        <Button type="submit">Ajouter</Button>
      </Form>
    </>
  );
};

export { NewTodoList as default };
