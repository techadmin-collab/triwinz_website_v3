export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/panel"],
      },
    ],
    sitemap: "https://triwinz.com/sitemap.xml",
  };
}
