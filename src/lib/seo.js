  /** Shared social preview image — keep in sync across layout + pages. */
export const OG_IMAGE = {
  url: "/og-share.png?v=3",
  width: 1200,
  height: 630,
  alt: "Triwinz Technologies",
};

export const defaultOpenGraph = {
  siteName: "Triwinz",
  locale: "en_US",
  type: "website",
  images: [OG_IMAGE],
};

export const defaultTwitter = {
  card: "summary_large_image",
  images: [OG_IMAGE.url],
};
  