import React from "react";
import HeroSection from "./sections/HeroSection";
import WhatWeOfferSection from "./sections/WhatWeOfferSection";
import WhyChooseUs from "./sections/WhyChooseUs";
import SpecialOffersSection from "./sections/SpecialOffersSection";
import { Box } from "@mui/material";

// Shared eVisa icons (also used on other pages) are recoloured to teal here only.
const tealIcons = {
  "& stop[stop-color='#5014d2ff' i], & stop[stop-color='#5014d2' i]": { stopColor: "#1D5758" },
  "& stop[stop-color='#dd3ca7fd' i], & stop[stop-color='#dd3ca7ff' i], & stop[stop-color='#dd3ca7' i]": { stopColor: "#2BD1C7" },
  "& [fill='#450CCA' i]": { fill: "#164546" },
};

const page = () => {
  return (
    <Box sx={tealIcons}>
      <HeroSection />
      <WhatWeOfferSection />
      <WhyChooseUs />
      <SpecialOffersSection />
    </Box>
  );
};

export default page;
