"use client";

import { use } from "react";
import JobForm from "../../../../components/JobForm";

export default function EditJobPage({ params }) {
  const { id } = use(params);
  return <JobForm jobId={id} />;
}
