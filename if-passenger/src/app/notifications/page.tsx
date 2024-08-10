import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { api } from "../api";
import { notification_type } from "../api/types";
import Notifications from "./_components/Notifications";

export default async function NotificationsPage() {
  const token = cookies().get("user_token")?.value;

  const request = await api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const request_data: notification_type[] = request.data;

  return (
    <main className="flex flex-col gap-7">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>

      <section className="flex flex-col items-center justify-center w-full">
        <h1>Notificações</h1>
        <Notifications notifications={request_data} />
      </section>
    </main>
  );
}
