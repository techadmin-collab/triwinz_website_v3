"use client";

import { use } from "react";
import JobView from "../../../components/JobView";

export default function ViewJobPage({ params }) {
  const { id } = use(params);
  return <JobView jobId={id} />;
}
