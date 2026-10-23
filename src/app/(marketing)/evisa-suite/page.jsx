import DeploymentOptionsSection from "./sections/DeploymentOptionsSection";
import EmiratiVisa from "./sections/EmiratiVisa";
import UseCasesSection from "./sections/UseCasesSection";
import VisaHero from "./sections/VisaHero";
import WhyEVisa from "./sections/WhyEVisa";
import CallToActionSection from "./sections/CallToActionSection";

export const metadata = {
  title:
    "eVisa Suite | Immigration & Electronic Visa Processing Platform - TRIWINZ",
  description:
    "Navigate the visa application process with Triwinz eVisa Suite. Enjoy a seamless experience and quick approvals for your international travels and convenience",
  alternates: {
    canonical: "https://triwinz.com/evisa-suite",
  },
};

export default function Page() {
  return (
    <>
      <VisaHero />
      <WhyEVisa />
      <EmiratiVisa />
      <UseCasesSection />
      <DeploymentOptionsSection />
      <CallToActionSection />
    </>
  );
}
