import { permanentRedirect } from "next/navigation";
import { TRAINING_PROGRAM_PATH } from "../sections/trainingProgram";

// Old URL used in earlier ads/links. Permanently redirects to the new page.
export default function LegacyTrainingProgramPage() {
  permanentRedirect(TRAINING_PROGRAM_PATH);
}
