import React from "react";
import ContactHero from "./sections/ContactHero";
import WhereWeWork from "./sections/WhereWeWork";
import ContactFormSection from "./sections/ContactFormSection";
import GlobalOutlookSection from "./sections/GlobalOutlookSection";

const page = () => {
  return (
    <>
      <ContactHero />
      <WhereWeWork />
      <ContactFormSection />
      <GlobalOutlookSection />
    </>
  );
};

export default page;
