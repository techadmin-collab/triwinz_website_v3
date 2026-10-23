import React from "react";
import CloudInfrastructureHero from "./sections/CloudInfrastructureHero";
import WhatWeDoSection from "./sections/WhatWeDoSection";
import ServicesDetailSection from "./sections/ServicesDetailSection";
import CloudCTA from "./sections/CloudCTA";

const page = () => {
  return (
    <>
      <CloudInfrastructureHero />
      <WhatWeDoSection />
      <ServicesDetailSection />
      <CloudCTA />
    </>
  );
};

export default page;
