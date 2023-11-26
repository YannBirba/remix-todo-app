import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  useActionData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema";
import { Button } from "react-aria-components";
import { css } from "styled-system/css";
import { Form } from "~/components/Form";
import { TextField } from "~/components/TextField";
import { hash } from "~/helpers/hashing";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  return json({} as const);
};

export const meta: MetaFunction<typeof loader> = ({}) => {
  return [];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const clonedData = request.clone();
  const formData = await clonedData.formData();
  const nameData = formData.get("name");
  const emailData = formData.get("email");
  const passwordData = formData.get("password");
  const passwordConfirmationData = formData.get("password-confirmation");

  if (!emailData || !passwordData || !passwordConfirmationData || !nameData) {
    return json({ error: "Missing data" }, { status: 400 });
  }

  const name = nameData.toString().trim();
  const email = emailData.toString().toLowerCase().trim();
  const password = passwordData.toString().trim();
  const passwordConfirmation = passwordConfirmationData.toString().trim();

  if (password !== passwordConfirmation) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }

  try {
    const hashPassword = await hash(password);
    await db.insert(users).values({
      email,
      name,
      password: hashPassword,
    });

    return redirect("/login");
  } catch (error) {
    // @ts-ignore
    if (error.message?.includes("UNIQUE constraint failed: users.email")) {
      return json({ error: "Email already in use" }, { status: 400 });
    }

    return json(
      // @ts-ignore
      { error: error.message as string, cause: error },
      // @ts-ignore
      { status: error.status ?? 500 }
    );
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div />;
  }
  return <div />;
}

const Register = () => {
  const actionData = useActionData<typeof action>();
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
        <fieldset
          disabled={
            (navigation.state === "loading" ||
              navigation.state === "submitting") ??
            undefined
          }
        >
          <TextField
            type="text"
            name="name"
            label="Name"
            isRequired
            autoFocus
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            isRequired
            inputMode="email"
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            autoComplete="current-password"
            isRequired
          />
          <TextField
            type="password"
            name="password-confirmation"
            label="Password confirmation"
            autoComplete="current-password"
            isRequired
          />
        </fieldset>
        <Button type="submit">Sign Up</Button>
      </Form>
      {actionData?.error ? <p>{actionData?.error}</p> : null}
    </div>
  );
};

export { Register as default };
