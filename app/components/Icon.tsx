import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import type { StyledComponent } from "styled-system/jsx";

import { icons } from "lucide-react";
import { styled } from "styled-system/jsx";

type IconProps = {
  readonly name: keyof typeof icons;
} & Omit<ComponentProps<StyledComponent<LucideIcon>>, "ref">;

export const Icon = ({ name, ...props }: IconProps) => {
  // eslint-disable-next-line security/detect-object-injection
  const LucideIcon = styled(icons[name]);

  return <LucideIcon aria-label={name + " icon"} aria-hidden {...props} />;
};
