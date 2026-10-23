import React from "react";
import EGovernanceHero from "./sections/EGovernanceHero";
import WhatWeDoSection from "./sections/WhatWeDoSection";
import ServicesDetailSection from "./sections/ServicesDetailSection";

export const metadata = {
  title:
    "eGovernance & Visa Platform Solutions | Government Immigration & Digital Transformation - TRIWINZ",
  description:
    "Triwinz offers cutting-edge eGovernance visa platform solutions to optimize your visa processes. Experience seamless management and improved efficiency today",
  alternates: {
    canonical: "https://triwinz.com/egovernance-visa-platform-solutions",
  },
};

const page = () => {
  return (
    <>
      <EGovernanceHero />
      <WhatWeDoSection />
      <ServicesDetailSection />
    </>
  );
};

export default page;
