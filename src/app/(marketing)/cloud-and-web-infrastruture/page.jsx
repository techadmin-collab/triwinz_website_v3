import { permanentRedirect } from "next/navigation";

// Old misspelled URL. Permanently redirects to the correct address.
export default function LegacyCloudInfrastructurePage() {
  permanentRedirect("/cloud-and-web-infrastructure");
}
