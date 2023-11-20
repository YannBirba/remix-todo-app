import type { LoaderFunctionArgs } from "@remix-run/node";
import { createEventStream } from "~/helpers/create-event-stream.server";

export function loader({ request }: LoaderFunctionArgs) {
  return createEventStream(request, "new-todo");
}
