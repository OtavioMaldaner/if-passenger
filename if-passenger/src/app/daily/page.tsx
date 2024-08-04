import Header from "@/components/default/Header";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";
import { api } from "../api";
import DailtTrips from "./_components/DailyTrips";

export default async function DailyPage() {
  const token = cookies().get("user_token")?.value;
  const request = await api.get("/trip/daily", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <main className="flex flex-col gap-10 items-center justify-center">
      <Header />
      <DailtTrips trips={request.data} />
      <footer className="fixed bottom-0 my-6 w-full px-4 flex justify-end">
        <Link href="/homepage">
          <Button>Entrar</Button>
        </Link>
      </footer>
    </main>
  );
}
