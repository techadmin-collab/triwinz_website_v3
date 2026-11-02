/** Shared Triwinz brand tokens for admin + site CTAs */
export const BRAND = {
  primary: "#1D5758",
  primaryDark: "#164546",
  accent: "#2BD1C7",
  accentDark: "#1A9E96",
  gradient: "linear-gradient(96deg, #1D5758 0%, #2BD1C7 100%)",
  gradientHover: "linear-gradient(96deg, #164546 0%, #1A9E96 100%)",
  gradientWide: "linear-gradient(122deg, #1D5758 0%, #2BD1C7 100%)",
  pageBg: "#F5FCFB",
  sidebarBg: "linear-gradient(165deg, #133B3C 0%, #1D5758 50%, #1F7E7A 100%)",
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
