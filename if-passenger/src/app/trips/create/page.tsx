import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CreateTripForm from "./_components/CreateTripForm";

export default function CreateTrip() {
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
      <CreateTripForm />
    </main>
  );
}
