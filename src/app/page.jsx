import ContactCTASection from "./(marketing)/home/ContactCTASection";
import HeroSection from "./(marketing)/home/HeroSection";
import HomeCaseStudies from "./(marketing)/home/HomeCaseStudies";
import ServiceCards from "./(marketing)/home/ServiceCards";
import ServicesSection from "./(marketing)/home/ServiceSection";
import { defaultOpenGraph, defaultTwitter } from "../lib/seo";

export const metadata = {
  title: "Triwinz | Global IT Solution Provider",
  description:
    "Triwinz is a technology company striving to accelerate business outcomes for its clients through expert information technology consulting and build simple and powerful products for people and business.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    ...defaultOpenGraph,
    title: "Triwinz | Global IT Solution Provider",
    description:
      "Triwinz is a technology company striving to accelerate business outcomes for its clients through expert information technology consulting and build simple and powerful products for people and business.",
    url: "/",
  },

  twitter: {
    ...defaultTwitter,
    title: "Triwinz | Global IT Solution Provider",
    description:
      "Triwinz is a technology company striving to accelerate business outcomes for its clients through expert information technology consulting and build simple and powerful products for people and business.",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      <HomeCaseStudies />

      {/* Services Section */}
      <ServiceCards />

      <ServicesSection />

      <ContactCTASection />
    </>
  );
}
