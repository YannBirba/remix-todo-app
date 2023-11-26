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
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { Button } from "react-aria-components";
import { css } from "styled-system/css";
import { Form } from "~/components/Form";
import { TextField } from "~/components/TextField";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSession(request.headers.get("Cookie"));

  const error = session.get("sessionErrorKey");
  return json<{ error: string }>({ error });
};

export const meta: MetaFunction<typeof loader> = ({}) => {
  return [];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div />;
  }
  return <div />;
}

const Login = () => {
  const { error } = useLoaderData<typeof loader>();
  useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      })}
    >
      <Form method="post">
        <TextField
          type="email"
          name="email"
          label="Email"
          isRequired
          autoFocus
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          isRequired
        />
        <Button type="submit">Sign In</Button>
      </Form>
      {error &&
      (navigation.formData?.get("email")?.toString() ||
        navigation.formData?.get("password")?.toString())
        ? error
        : null}
    </div>
  );
};

export { Login as default };
