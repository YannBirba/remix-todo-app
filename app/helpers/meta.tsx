import type { MetaDescriptor } from "@remix-run/node";

type Meta = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  twitterUsername?: string;
  themeColor?: string;
};

export const generateMeta = ({
  title,
  description,
  image,
  url,
  type,
  siteName,
  locale,
  twitterUsername,
  themeColor,
}: Meta): MetaDescriptor[] => {
  return [
    {
      name: "description",
      content: description,
    },
    {
      title: title,
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:site",
      content: url,
    },
    {
      name: "twitter:creator",
      content: twitterUsername,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      name: "twitter:image",
      content: image,
    },
    {
      name: "og:title",
      content: title,
    },
    {
      name: "og:description",
      content: description,
    },
    {
      name: "og:image",
      content: image,
    },
    {
      name: "og:url",
      content: url,
    },
    {
      name: "og:site_name",
      content: siteName,
    },
    {
      name: "og:locale",
      content: locale,
    },
    {
      name: "og:type",
      content: type,
    },
    {
      name: "theme-color",
      content: themeColor,
    },
  ];
};
