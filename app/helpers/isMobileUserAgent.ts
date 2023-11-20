export const isMobileUserAgent = (request: Request) => {
  const userAgent = request.headers.get("user-agent") || "";
  return /Mobile|Android|iPhone|iP(ad|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk|webOS|Fennec|Opera M(obi|ini)|Dolfin|Dolphin|Skyfire|Zune/i.test(
    userAgent
  );
};
