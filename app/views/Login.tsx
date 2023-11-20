import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

export const loader = async ({}: LoaderFunctionArgs) => {
  return json({} as const);
};

export const meta: MetaFunction<typeof loader> = ({}) => {
  return [];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return json({} as const);
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div />;
  }
  return <div />;
}

const Login = () => {
  useLoaderData<typeof loader>();
  useActionData<typeof action>();

  return (
    <>
      <h1>Login page</h1>
    </>
  );
};

export { Login as default };