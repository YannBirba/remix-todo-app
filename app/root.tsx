import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "@remix-run/react";
import { I18nProvider, RouterProvider, useLocale } from "react-aria";
// import "./index.css";

export default function App() {
  const { locale, direction } = useLocale();
  const navigate = useNavigate();

  return (
    <html lang={locale} dir={direction}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <RouterProvider navigate={navigate}>
            <Outlet />
          </RouterProvider>
        </I18nProvider>
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}
