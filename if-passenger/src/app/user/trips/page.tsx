import { api } from "@/app/api";
import { trip_type } from "@/app/api/types";
import Feed from "@/components/default/Feed";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function UserTrips() {
  const req = await api.get("/trips/user", {
    headers: {
      Authorization: `Bearer ${cookies().get("user_token")?.value}`,
    },
  });
  const trips: trip_type[] = req.data;
  return (
    <main className="flex">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>

      <section className="mt-[110px] flex flex-col items-center justify-center w-full h-full gap-10">
        <h1 className="text-xl">Minhas Viagens</h1>
        {trips.length > 0 ? (
          <Feed trips={trips} />
        ) : (
          <span className="text-center">
            Você não possui nenhuma viagem marcada para as próximas duas
            semanas!
          </span>
        )}
      </section>
    </main>
  );
}
