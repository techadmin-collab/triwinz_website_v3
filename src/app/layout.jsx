import "./globals.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ThemeRegistry from "../theme/ThemeRegistry";
import { inter } from "./fonts";
import { defaultOpenGraph, defaultTwitter, OG_IMAGE } from "../lib/seo";

export const metadata = {
  metadataBase: new URL("https://triwinz.com"),

  title: {
    default:
      "Border Management System | Immigration & Visa Solutions, PoE Automation - TRIWINZ",
    template: "%s | TRIWINZ",
  },

  description:
    "Transform your business with Triwinz's expert solutions. We provide tailored services that empower growth and streamline operations for lasting success.",

  keywords: [
    "IT and Digital Transformation",
    "SAP Consulting and Support Services",
    "Cloud and Web Infrastructure",
    "Custom Software and ERP Development",
    "eGovernance and Visa Platform Solutions",
  ],

  authors: [{ name: "Triwinz Team", url: "https://triwinz.com" }],

  alternates: {
    canonical: "https://triwinz.com",
  },

  openGraph: {
    ...defaultOpenGraph,
    title: "TriWinz Technologies | Enterprise IT, SAP & AI Transformation",
    description:
      "TriWinz Technologies delivers enterprise IT consulting, SAP services, AI-powered software solutions, cloud infrastructure, digital transformation, and custom application development for businesses worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },

  twitter: {
    ...defaultTwitter,
    title: "TriWinz Technologies | Enterprise IT, SAP & AI Transformation",
    description:
      "Modern web & software development company focused on performance and SEO.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Triwinz",
  url: "https://triwinz.com",
  logo: `https://triwinz.com${OG_IMAGE.url.split("?")[0]}`,
  sameAs: [
    "https://www.linkedin.com/company/triwinz-technologies-india/",
    "https://www.facebook.com/share/18Hr84Z4Mk/",
    "https://www.instagram.com/triwinz_tech",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <ThemeRegistry>
          <Header />
          {children}
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
