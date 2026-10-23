"use client";

import { useSession } from "next-auth/react";
import UserForm from "../../../components/UserForm";

export default function NewUserPage() {
  const { data: session } = useSession();
  return <UserForm currentRole={session?.user?.role} />;
}
