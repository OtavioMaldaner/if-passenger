import { api } from "@/app/api";
import { user_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import User from "./_components/User";

export default async function userPage({
  params,
}: {
  params: { registrationNumber: string };
}) {
  const registrationNumber: string = params.registrationNumber;
  const token = cookies().get("user_token")?.value;

  const userRequest = await api.get(`/user/${registrationNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user: user_type = userRequest.data;
  return (
    <main className="flex flex-col items-center gap-10">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>
      <User user={user} />
    </main>
  );
}
