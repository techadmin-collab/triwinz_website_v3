import React from "react";
import HeroSection from "./sections/HeroSection";
import WhatWeDoSection from "./sections/WhatWeDoSection";
import ServicesDetailSection from "./sections/ServicesDetailSection";
import WhyTriWinzSection from "./sections/WhyTriWinzSection";
import KeyProjectHighlights from "./sections/KeyProjectHighlights";
import ConsultingSpectrum from "./sections/ConsultingSpectrum";
import CoCreateCTA from "./sections/CoCreateCTA";

export const metadata = {
  title:
    "IT & Digital Transformation | Digital Border Control & Consulting Services - TRIWINZ",
  description:
    "Navigate the complexities of IT digital transformation. Access valuable insights and tools to streamline and enhance your organization's digital capabilities",
  alternates: {
    canonical: "https://triwinz.com/it-digital-transformation",
  },
};

const page = () => {
  return (
    <>
      <HeroSection />
      <WhatWeDoSection />
      <ServicesDetailSection />
      <WhyTriWinzSection />
      <KeyProjectHighlights />
      <ConsultingSpectrum />
      <CoCreateCTA />
    </>
  );
};

export default page;
