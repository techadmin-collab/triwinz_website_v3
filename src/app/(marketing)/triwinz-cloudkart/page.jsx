import React from "react";
import ProductHeroSection from "./sections/ProductHeroSection";
import KeyFeaturesSection from "./sections/KeyFeaturesSection";
import IndianRetailSolutionSection from "./sections/IndianRetailSolutionSection";
import PricingSpecialOffers from "./sections/PricingSpecialOffers";
import ClosingCTASection from "./sections/ClosingCTASection";

export const metadata = {
  title:
    "TriWinz CloudKart | Secure Cloud & Web Infrastructure Management Services - TRIWINZ",
  description:
    "Experience the future of data management with Triwinz CloudKart. Secure, efficient, and tailored cloud solutions in order to elevate your business operations",
  alternates: {
    canonical: "https://triwinz.com/triwinz-cloudkart",
  },
};

const page = () => {
  return (
    <>
      <ProductHeroSection />
      <KeyFeaturesSection />
      <IndianRetailSolutionSection />
      <PricingSpecialOffers />
      <ClosingCTASection />
    </>
  );
};

export default page;
