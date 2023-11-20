import {
  json,
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

export const loader = async ({}: LoaderFunctionArgs) => {
  return json({} as const);
};

export const meta: MetaFunction<typeof loader> = ({}) => {
  return generateMeta({
    description: "Ajouter une todolist",
    title: "Ajouter une todolist",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const titleData = data.get("title");
  const userIdData = data.get("userId");

  if (!titleData || !userIdData) throw new Error("Missing data");

  const title = titleData.toString();
  const userId = parseInt(userIdData.toString());

  if (!title || !userId) throw new Error("Incorrect data");

  try {
    const { lastInsertRowid } = await db
      .insert(todoLists)
      .values({ title, userId });
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
        <input type="hidden" name="userId" value="1" />
        <Button type="submit">Ajouter</Button>
      </Form>
    </>
  );
};

export { NewTodoList as default };
