"use client";

import { use } from "react";
import CaseStudyForm from "../../../../components/CaseStudyForm";

export default function EditCaseStudyPage({ params }) {
  const { id } = use(params);
  return <CaseStudyForm caseStudyId={id} />;
}
