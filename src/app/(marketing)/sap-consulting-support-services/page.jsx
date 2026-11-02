import React from "react";
import SAPHero from "./sections/SAPHero";
import WhatWeOffer from "./sections/WhatWeOffer";
import ServicesDetailSection from "./sections/ServicesDetailSection";
import WhyTriWinzSection from "./sections/WhyTriWinzSection";
import SAPCTA from "./sections/SAPCTA";
import { Box } from "@mui/material";

// Shared icons (also used on other pages) are recoloured to teal here only.
const tealIcons = {
  "& stop[stop-color='#5014d2ff' i], & stop[stop-color='#5014d2' i]": { stopColor: "#1D5758" },
  "& stop[stop-color='#dd3ca7fd' i], & stop[stop-color='#dd3ca7ff' i], & stop[stop-color='#dd3ca7' i]": { stopColor: "#2BD1C7" },
};

export const metadata = {
  title:
    "SAP Consulting & Support Services | S/4HANA Migration & Integration - TRIWINZ",
  description:
    "Unlock the full potential of your SAP systems with our specialized consulting and support services. Experience seamless integration and the expert guidance",
  alternates: {
    canonical: "https://triwinz.com/sap-consulting-support-services",
  },
};

const page = () => {
  return (
    <Box sx={tealIcons}>
      <SAPHero />
      <WhatWeOffer />
      <ServicesDetailSection />
      <WhyTriWinzSection />
      <SAPCTA />
    </Box>
  );
};

export default page;
