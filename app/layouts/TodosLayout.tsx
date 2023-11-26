import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { deferIf } from "defer-if";
import { Suspense } from "react";
import { Button, Link } from "react-aria-components";
import { css } from "styled-system/css";
import { Form } from "~/components/Form";
import { Icon } from "~/components/Icon";
import { isMobileUserAgent } from "~/helpers/isMobileUserAgent";
import { generateMeta } from "~/helpers/meta";
import { useRouteLiveLoader } from "~/helpers/useLiveLoader";
import { getTodolists } from "~/loaders/getTodolists";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!user) return redirect("/login");

  const data = {
    todoLists: getTodolists(user.id),
  };
  return await deferIf(data, isMobileUserAgent(request));
};

export const meta: MetaFunction<typeof loader> = ({}) => {
  return generateMeta({
    description: "Mes todolists",
    title: "TODO",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return await authenticator.logout(request, { redirectTo: "/login" });
};

const TodosLayout = () => {
  const { todoLists } = useLoaderData<typeof loader>();
  useRouteLiveLoader("/new");

  return (
    <div
      className={css({
        display: "flex",
        height: "100%",
        width: "100%",
      })}
    >
      <nav
        className={css({
          height: "100%",
          padding: "4",
          borderRight: "2px solid",
        })}
      >
        <Link
          href="/"
          className={css({
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
            textDecoration: "none",
            color: "inherit",
          })}
        >
          <Icon name="Home" /> Home
        </Link>
        <Suspense fallback="Loading...">
          <Await resolve={todoLists}>
            {(value) => (
              <ul>
                {value &&
                  value.length > 0 &&
                  value.map((todoList) => (
                    <li key={todoList.id}>
                      <Link href={`/${todoList.id}`}>{todoList.title}</Link>
                    </li>
                  ))}
              </ul>
            )}
          </Await>
        </Suspense>
        <Link
          href="/new"
          className={css({
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
            textDecoration: "none",
            color: "inherit",
          })}
        >
          Ajouter
          <Icon name="Plus" />
        </Link>
        <Form method="post" action="/">
          <Button type="submit">Logout</Button>
        </Form>
      </nav>
      <main className={css({ flexGrow: 1, padding: "4" })}>
        <Outlet />
      </main>
    </div>
  );
};

export { TodosLayout as default };
