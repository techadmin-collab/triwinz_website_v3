import React from "react";
import CustomSoftwareHero from "./sections/CustomSoftwareHero";
import WhatWeDoSection from "./sections/WhatWeDoSection";
import ServicesDetailSection from "./sections/ServicesDetailSection";
import DevelopmentCTA from "./sections/DevelopmentCTA";

export const metadata = {
  title: "Custom Software & ERP Development | Business ERP Solutions - TRIWINZ",
  description:
    "Maximize efficiency with Triwinz's custom ERP development services. Custom tailored solutions to fit your business needs and drive success in your industry",
  alternates: {
    canonical: "https://triwinz.com/custom-software-erp-development",
  },
};

const page = () => {
  return (
    <>
      <CustomSoftwareHero />
      <WhatWeDoSection />
      <ServicesDetailSection />
      <DevelopmentCTA />
    </>
  );
};

export default page;
