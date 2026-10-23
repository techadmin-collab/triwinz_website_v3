import React from "react";
import HeroSection from "./sections/HeroSection";
import WhatWeOfferSection from "./sections/WhatWeOfferSection";
import WhyChooseUs from "./sections/WhyChooseUs";
import SpecialOffersSection from "./sections/SpecialOffersSection";

const page = () => {
  return (
    <>
      <HeroSection />
      <WhatWeOfferSection />
      <WhyChooseUs />
      <SpecialOffersSection />
    </>
  );
};

export default page;
