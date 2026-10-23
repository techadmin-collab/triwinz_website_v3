"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import UserForm from "../../../../components/UserForm";

export default function EditUserPage({ params }) {
  const { id } = use(params);
  const { data: session } = useSession();
  return <UserForm userId={id} currentRole={session?.user?.role} />;
}
