import PanelInterviewDetail from "./PanelInterviewDetail";

export const metadata = { title: "Interview" };

export default async function PanelInterviewPage({ params }) {
  const { roundId } = await params;
  return <PanelInterviewDetail roundId={roundId} />;
}
