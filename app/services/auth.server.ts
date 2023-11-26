import { db } from "db";
import { User, users } from "db/schema";
import { eq } from "drizzle-orm";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { verify } from "~/helpers/hashing";
import { sessionStorage } from "~/services/session.server";

const login = async (
  email?: string,
  password?: string
): Promise<User | undefined> => {
  if (!email || !password || email?.length === 0 || password?.length === 0) {
    throw new AuthorizationError("Invalid email or password");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email.trim().toLowerCase()),
  });

  const passwordMatch = await verify(password.trim(), user?.password ?? "");

  if (user && passwordMatch) {
    return user;
  } else {
    throw new AuthorizationError("Invalid email or password");
  }
};

export const authenticator = new Authenticator<User | undefined>(
  sessionStorage,
  {
    sessionKey: "sessionKey", // keep in sync
    sessionErrorKey: "sessionErrorKey", // keep in sync
  }
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    const user = await login(email, password);
    return user;
  }),
  "user-pass"
);
