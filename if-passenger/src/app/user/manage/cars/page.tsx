import { api } from "@/app/api";
import { user_car_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import UserCarsList from "./_components/UserCarsList";

export default async function ManageCars() {
  const token = cookies().get("user_token")?.value ?? "";

  const request = await api.get("/cars", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const cars: user_car_type[] = request.data;

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
      <section className="mt-[110px] flex flex-col items-center justify-center w-full gap-10">
        <h1 className="text-xl">Gerenciar Veículos</h1>
        <UserCarsList cars={cars} />

        <Link
          href="/register/car"
          className="fixed bottom-0 my-6 w-full flex items-center justify-center"
        >
          <Button>Adicionar Veículo</Button>
        </Link>
      </section>
    </main>
  );
}
