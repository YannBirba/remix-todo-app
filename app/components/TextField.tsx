import type { TextFieldProps, ValidationResult } from "react-aria-components";
import {
  FieldError,
  Input,
  Label,
  TextField as RACTextField,
  Text,
} from "react-aria-components";
import { css } from "styled-system/css";

type MyTextFieldProps = {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
} & TextFieldProps;

export const TextField = ({
  label,
  description,
  errorMessage,
  ...props
}: MyTextFieldProps) => {
  return (
    <RACTextField
      {...props}
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 1,
      })}
    >
      <Label>{label}</Label>
      <Input />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </RACTextField>
  );
};
