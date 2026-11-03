import AboutHero from "./sections/AboutHero";
import CompanyStory from "./sections/CompanyStory";
import CTASection from "./sections/CTASection";
import DevelopmentCulture from "./sections/DevelopmentCulture";
// import MissionVision from "./sections/MissionVision";
import ValuesSection from "./sections/ValuesSection";
import WhatWeDo from "./sections/WhatWeDo";
import WhyTriwinz from "./sections/WhyTriwinz";
import TeamSection from "./sections/TeamSection";
import { prisma } from "../../../lib/prisma";
import { DEFAULT_TEAM } from "../../../lib/teamDefaults";

// Re-check the team at most every 5 minutes; admin changes also refresh it right away.
export const revalidate = 300;

async function getTeam() {
  // Database client not regenerated yet (npx prisma generate): use the built-in team
  if (!prisma.teamMember) return DEFAULT_TEAM;
  try {
    const members = await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, role: true, bio: true, photoUrl: true, linkedin: true },
    });
    // Nothing in the database yet: keep showing the original built-in team
    if (members.length === 0) {
      const total = await prisma.teamMember.count();
      if (total === 0) return DEFAULT_TEAM;
    }
    return members;
  } catch (error) {
    console.warn("Could not load team members, showing the built-in team:", error?.message);
    return DEFAULT_TEAM;
  }
}

export const metadata = {
  title: "About Us | TriWinz Technologies",
  description:
    "Learn more about TriWinz Technologies, our mission, vision, leadership, and how we help businesses scale with smart IT solutions.",
  alternates: {
    canonical: "https://triwinz.com/about",
  },
};

export default async function AboutUsPage() {
  const team = await getTeam();

  return (
    <>
      <AboutHero />
      <CompanyStory />
      <WhyTriwinz />
      {/* <MissionVision /> */}
      <TeamSection members={team} />
      <DevelopmentCulture />
      <WhatWeDo />
      <ValuesSection />
      <CTASection />
    </>
  );
}
