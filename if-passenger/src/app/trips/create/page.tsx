import { api } from "@/app/api";
import { address_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import CreateTripForm from "./_components/CreateTripForm";

export default async function CreateTrip() {
  // const token = cookies().get("user_token")?.value;
  const addressess: address_type[] = await fetch(
    "http://localhost:3333/addresses",
    { method: "GET" }
  ).then((res) => res.json());
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>
      <h1 className="font-bold text-xl">Criar Viagem</h1>
      <CreateTripForm addresses={addressess} />
    </main>
  );
}
