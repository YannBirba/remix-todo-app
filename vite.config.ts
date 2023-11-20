import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { remixDevTools } from "remix-development-tools/vite";
// @ts-ignore
import { jsonRoutes } from "remix-json-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
      },
      ignoredRouteFiles: ["**/**"],
      routes(defineRoutes) {
        return jsonRoutes(defineRoutes, [
          {
            path: "/",
            file: "layouts/TodosLayout.tsx",
            children: [
              {
                index: true,
                file: "views/TodoIndex.tsx",
              },
              {
                path: "/new",
                file: "views/NewTodoList.tsx",
                children: [
                  {
                    path: "stream",
                    file: "streams/NewTodoListStream.ts",
                  },
                ],
              },
              {
                path: "/:id",
                file: "views/TodoList.tsx",
                children: [
                  {
                    path: "stream",
                    file: "streams/TodoStream.ts",
                  },
                ],
              },
            ],
          },
          {
            path: "/login",
            file: "views/Login.tsx",
          },
          {
            path: "/register",
            file: "views/Register.tsx",
          },
        ]);
      },
    }),
    tsconfigPaths(),
    remixDevTools(),
  ],
});
