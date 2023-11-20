import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import {
  Await,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { deferIf } from "defer-if";
import { Suspense } from "react";
import { Link } from "react-aria-components";
import { css } from "styled-system/css";
import { Icon } from "~/components/Icon";
import { isMobileUserAgent } from "~/helpers/isMobileUserAgent";
import { generateMeta } from "~/helpers/meta";
import { useRouteLiveLoader } from "~/helpers/useLiveLoader";
import { getTodolists } from "~/loaders/getTodolists";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data = {
    todoLists: getTodolists(),
  };
  return await deferIf(data, isMobileUserAgent(request));
};

export const meta: MetaFunction<typeof loader> = ({}) => {
  return generateMeta({
    description: "Mes todolists",
    title: "TODO",
  });
};

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops!</h1>
        <p>Something went wrong.</p>
        <pre>{error.message}</pre>
      </div>
    );
  }
  return (
    <div>
      <h1>Oops!</h1>
      <p>Something went wrong.</p>
    </div>
  );
}

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
      </nav>
      <main className={css({ flexGrow: 1, padding: "4" })}>
        <Outlet />
      </main>
    </div>
  );
};

export { TodosLayout as default };
