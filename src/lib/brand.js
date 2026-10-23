/** Shared Triwinz brand tokens for admin + site CTAs */
export const BRAND = {
  primary: "#5014D2",
  primaryDark: "#4310b3",
  accent: "#DD3CA7",
  accentDark: "#c43393",
  gradient: "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
  gradientHover: "linear-gradient(96deg, #4310b3 0%, #c43393 100%)",
  gradientWide: "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
  pageBg: "#faf8ff",
  sidebarBg: "linear-gradient(165deg, #5014D2 0%, #8a2bc4 45%, #DD3CA7 100%)",
  glass: "#838383CC",
};

export const brandButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  color: "#fff",
  borderRadius: "10px",
  backgroundImage: BRAND.gradient,
  boxShadow: "none",
  "&:hover": {
    backgroundImage: BRAND.gradientHover,
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    color: "#fff",
    backgroundImage: BRAND.gradient,
    opacity: 0.7,
  },
};
