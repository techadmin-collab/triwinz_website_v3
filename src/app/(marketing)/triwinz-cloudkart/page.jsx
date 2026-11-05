import React from "react";
import ProductHeroSection from "./sections/ProductHeroSection";
import KeyFeaturesSection from "./sections/KeyFeaturesSection";
import IndianRetailSolutionSection from "./sections/IndianRetailSolutionSection";
import PricingSpecialOffers from "./sections/PricingSpecialOffers";
import ClosingCTASection from "./sections/ClosingCTASection";
import { Box } from "@mui/material";

// Shared eVisa icons (also used on other pages) are recoloured to teal here only.
const tealIcons = {
  "& stop[stop-color='#5014d2ff' i], & stop[stop-color='#5014d2' i]": { stopColor: "#1D5758" },
  "& stop[stop-color='#dd3ca7fd' i], & stop[stop-color='#dd3ca7ff' i], & stop[stop-color='#dd3ca7' i]": { stopColor: "#2BD1C7" },
  "& [fill='#450CCA' i]": { fill: "#164546" },
};

export const metadata = {
  title:
    "TriWinz CloudKart | Secure Cloud & Web Infrastructure Management Services - TriWinz",
  description:
    "Experience the future of data management with TriWinz CloudKart. Secure, efficient, and tailored cloud solutions in order to elevate your business operations",
  alternates: {
    canonical: "https://triwinz.com/triwinz-cloudkart",
  },
};

const page = () => {
  return (
    <Box sx={tealIcons}>
      <ProductHeroSection />
      <KeyFeaturesSection />
      <IndianRetailSolutionSection />
      <PricingSpecialOffers />
      <ClosingCTASection />
    </Box>
  );
};

export default page;
