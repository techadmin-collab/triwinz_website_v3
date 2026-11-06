import PanelAvailability from "./PanelAvailability";

// Private page for an interview panel member (opened from the link the admin shares).
export const metadata = {
  title: "Share your availability",
  robots: { index: false, follow: false },
};

export default async function PanelPage({ params }) {
  const { token } = await params;
  return <PanelAvailability token={token} />;
}
