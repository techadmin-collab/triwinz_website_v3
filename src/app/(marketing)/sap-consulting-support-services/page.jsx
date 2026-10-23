import React from "react";
import SAPHero from "./sections/SAPHero";
import WhatWeOffer from "./sections/WhatWeOffer";
import ServicesDetailSection from "./sections/ServicesDetailSection";
import WhyTriWinzSection from "./sections/WhyTriWinzSection";
import SAPCTA from "./sections/SAPCTA";

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
    <>
      <SAPHero />
      <WhatWeOffer />
      <ServicesDetailSection />
      <WhyTriWinzSection />
      <SAPCTA />
    </>
  );
};

export default page;
