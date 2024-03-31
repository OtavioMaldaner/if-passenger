import { salvarTokenNoCookie } from "@/app/api/functions";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default function ManageCars() {
  salvarTokenNoCookie(cookies().get("user_token")?.value ?? "");
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

      <h1 className="text-xl">Gerenciar Veículos</h1>
    </main>
  );
}
