import { type MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Link } from "react-aria-components";
import { generateMeta } from "~/helpers/meta";

export const meta: MetaFunction = ({}) => {
  return generateMeta({
    description: "Créer une todolist",
    title: "TODO",
  });
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div />;
  }
  return <div />;
}

const TodoIndex = () => {
  return (
    <>
      <h1>TodoIndex page</h1>
      <p>Pour créer une todolist, il faut aller sur la page</p>
      <Link href="/new">Créer une todolist</Link>
    </>
  );
};

export { TodoIndex as default };
