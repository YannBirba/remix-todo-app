import {
  useLoaderData,
  useResolvedPath,
  useRevalidator,
  useRouteLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";

export const useLiveLoader = <T>() => {
  const path = useResolvedPath("./stream");
  const data = useEventSource(path.pathname);

  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- "we know better" — Moishi
  }, [data]);

  return useLoaderData<T>();
};

export const useRouteLiveLoader = <T>(routeId: string) => {
  const path = useResolvedPath(`${routeId}/stream`);
  const data = useEventSource(path.pathname);

  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- "we know better" — Moishi
  }, [data]);

  return useRouteLoaderData<T>(routeId);
};
