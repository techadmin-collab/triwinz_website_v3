import PanelShell from "./PanelShell";

// Private portal for an interview panel member (opened from the link the admin shares).
export const metadata = {
  title: { default: "Interview panel", template: "%s | TriWinz interview panel" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children, params }) {
  const { token } = await params;
  return <PanelShell token={token}>{children}</PanelShell>;
}
