import { useLocation, useSubmit } from "@remix-run/react";
import { ComponentProps, FormEvent } from "react";
import { Form as RACForm } from "react-aria-components";

type FormProps = {
  actionDataErrors?: Record<string, string>;
} & ComponentProps<typeof RACForm>;

export const Form = ({
  actionDataErrors,
  children,
  action,
  ...props
}: FormProps) => {
  const submit = useSubmit();
  const location = useLocation();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(e.currentTarget);
  };

  return (
    <RACForm
      validationErrors={actionDataErrors}
      onSubmit={onSubmit}
      action={action ?? location.pathname}
      {...props}
    >
      {children}
    </RACForm>
  );
};
