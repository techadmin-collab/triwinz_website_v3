import React from "react";
import BisBuddyHeroSection from "./sections/BisBuddyHeroSection";
import WhyBisBuddySection from "./sections/WhyBisBuddySection";
import CoreERPModulesSection from "./sections/CoreERPModulesSection";
import WhoCanUseBisBuddySection from "./sections/WhoCanUseBisBuddySection";
import KeyBenefitsSection from "./sections/KeyBenefitsSection";
import FinalCTASection from "./sections/FinalCTASection";
import { Box } from "@mui/material";

// Shared eVisa icons (also used on other pages) are recoloured to teal here only.
const tealIcons = {
  "& stop[stop-color='#5014d2ff' i], & stop[stop-color='#5014d2' i]": { stopColor: "#1D5758" },
  "& stop[stop-color='#dd3ca7fd' i], & stop[stop-color='#dd3ca7ff' i], & stop[stop-color='#dd3ca7' i]": { stopColor: "#2BD1C7" },
};

const page = () => {
  return (
    <Box sx={tealIcons}>
      <BisBuddyHeroSection />
      <WhyBisBuddySection />
      <CoreERPModulesSection />
      <WhoCanUseBisBuddySection />
      <KeyBenefitsSection />
      <FinalCTASection />
    </Box>
  );
};

export default page;
