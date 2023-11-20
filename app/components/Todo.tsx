import { Todo as TodoType } from "db/schema";
import { Button } from "react-aria-components";
import { flushSync } from "react-dom";
import { css } from "styled-system/css";
import { useDebounceFetcher } from "~/helpers/useDebounceFetcher";
import { Form } from "./Form";
import { Icon } from "./Icon";

export type TodoProps = {} & TodoType;

export const Todo = ({ id, ...todo }: TodoProps) => {
  const fetcher = useDebounceFetcher();

  const completed = fetcher.formData ? fetcher.formData.get(`todo-completed-${id}`) === "on" : todo.completed;
  const name = fetcher.formData ? fetcher.formData.get(`todo-name-${id}`)?.toString() ?? todo.name : todo.name;

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 2,
      })}
    >
      <fetcher.Form method="post">
        <fieldset
          disabled={
            fetcher.state === "submitting" || fetcher.state === "loading"
          }
          className={css({
            opacity:
              fetcher.state === "submitting" || fetcher.state === "loading"
                ? 0.5
                : 1,
          })}
        >
          <input type="hidden" name="action" value="update" />
          <input type="hidden" name="id" value={id} />
          <input
            type="checkbox"
            name={`todo-completed-${id}`}
            id={`todo-completed-${id}`}
            checked={completed}
            onChange={(e) => {
              fetcher.submit(e.currentTarget.form);
            }}
          />
          <input
            type="text"
            name={`todo-name-${id}`}
            id={`todo-name-${id}`}
            defaultValue={name}
            onChange={(e) => {
              flushSync(() => {
                fetcher.debounceSubmit(e.currentTarget.form, {
                  replace: true,
                  debounceTimeout: 500,
                });
              });
              e.currentTarget.focus();
            }}
          />
        </fieldset>
      </fetcher.Form>

      <Form method="post">
        <Button type="submit">
          <input type="hidden" name="action" value="delete" />
          <input type="hidden" name="id" value={id} />
          <Icon name="X" />
        </Button>
      </Form>
    </div>
  );
};
