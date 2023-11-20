import {
  unstable_createViteServer as createViteServer,
  unstable_loadViteServerBuild as loadViteServerBuild,
} from "@remix-run/dev";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";

installGlobals();

let vite =
  process.env.NODE_ENV === "production" ? undefined : await createViteServer();

const app = express();

// handle asset requests
if (vite) {
  app.use(vite.middlewares);
} else {
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
  );
}
app.use(express.static("public", { maxAge: "1h" }));

// handle SSR requests
app.all(
  "*",
  createRequestHandler({
    build: vite
      ? () => loadViteServerBuild(vite)
      : await import("./build/index.js"),
  })
);

const port = 3000;
app.listen(port, () => console.log(`⚡ Server running at http://localhost:${port}`));
