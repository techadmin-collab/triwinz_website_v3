import { Suspense } from "react";
import PanelInterviews from "./PanelInterviews";

export const metadata = { title: "My interviews" };

export default function PanelInterviewsPage() {
  return (
    <Suspense fallback={null}>
      <PanelInterviews />
    </Suspense>
  );
}
