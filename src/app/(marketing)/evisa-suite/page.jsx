import DeploymentOptionsSection from "./sections/DeploymentOptionsSection";
import EmiratiVisa from "./sections/EmiratiVisa";
import UseCasesSection from "./sections/UseCasesSection";
import VisaHero from "./sections/VisaHero";
import WhyEVisa from "./sections/WhyEVisa";
import CallToActionSection from "./sections/CallToActionSection";
import { Box } from "@mui/material";

// Shared icons (also used on other pages) are recoloured to teal here only.
const tealIcons = {
  "& stop[stop-color='#5014d2ff' i], & stop[stop-color='#5014d2' i]": { stopColor: "#1D5758" },
  "& stop[stop-color='#dd3ca7fd' i], & stop[stop-color='#dd3ca7ff' i], & stop[stop-color='#dd3ca7' i]": { stopColor: "#2BD1C7" },
  "& [fill='#450CCA' i]": { fill: "#164546" },
};

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
    <Box sx={tealIcons}>
      <VisaHero />
      <WhyEVisa />
      <EmiratiVisa />
      <UseCasesSection />
      <DeploymentOptionsSection />
      <CallToActionSection />
    </Box>
  );
}
