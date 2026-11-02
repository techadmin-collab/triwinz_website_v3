import React from "react";
import CloudInfrastructureHero from "./sections/CloudInfrastructureHero";
import WhatWeDoSection from "./sections/WhatWeDoSection";
import ServicesDetailSection from "./sections/ServicesDetailSection";
import CloudCTA from "./sections/CloudCTA";

export const metadata = {
  title: "Cloud & Web Infrastructure",
  description:
    "Managed cloud hosting and web infrastructure from TriWinz: fast, scalable and reliable, with round-the-clock support and seamless integration for cloud-native and legacy applications.",
  alternates: {
    canonical: "https://triwinz.com/cloud-and-web-infrastructure",
  },
};

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
