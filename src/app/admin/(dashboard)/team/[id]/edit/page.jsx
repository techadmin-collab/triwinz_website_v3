"use client";

import { use } from "react";
import TeamMemberForm from "../../../../components/TeamMemberForm";

export default function EditTeamMemberPage({ params }) {
  const { id } = use(params);
  return <TeamMemberForm memberId={id} />;
}
