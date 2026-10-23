import AboutHero from "./sections/AboutHero";
import CompanyStory from "./sections/CompanyStory";
import CTASection from "./sections/CTASection";
import DevelopmentCulture from "./sections/DevelopmentCulture";
// import MissionVision from "./sections/MissionVision";
import ValuesSection from "./sections/ValuesSection";
import WhatWeDo from "./sections/WhatWeDo";
import WhyTriwinz from "./sections/WhyTriwinz";
import TeamSection from "./sections/TeamSection";

export const metadata = {
  title: "About Us | TriWinz Technologies",
  description:
    "Learn more about TriWinz Technologies, our mission, vision, leadership, and how we help businesses scale with smart IT solutions.",
  alternates: {
    canonical: "https://triwinz.com/about",
  },
};

export default function AboutUsPage() {
  return (
    <>
      <AboutHero />
      <CompanyStory />
      <WhyTriwinz />
      {/* <MissionVision /> */}
      <TeamSection />
      <DevelopmentCulture />
      <WhatWeDo />
      <ValuesSection />
      <CTASection />
    </>
  );
}
