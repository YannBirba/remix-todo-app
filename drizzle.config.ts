import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
