import React from "react";
import BisBuddyHeroSection from "./sections/BisBuddyHeroSection";
import WhyBisBuddySection from "./sections/WhyBisBuddySection";
import CoreERPModulesSection from "./sections/CoreERPModulesSection";
import WhoCanUseBisBuddySection from "./sections/WhoCanUseBisBuddySection";
import KeyBenefitsSection from "./sections/KeyBenefitsSection";
import FinalCTASection from "./sections/FinalCTASection";

const page = () => {
  return (
    <>
      <BisBuddyHeroSection />
      <WhyBisBuddySection />
      <CoreERPModulesSection />
      <WhoCanUseBisBuddySection />
      <KeyBenefitsSection />
      <FinalCTASection />
    </>
  );
};

export default page;
