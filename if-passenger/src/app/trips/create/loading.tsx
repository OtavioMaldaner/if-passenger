import Header from "@/components/default/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="flex flex-col w-screen justify-center items-center">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>
      <h1 className="font-bold text-xl text-center pb-8">Criar Viagem</h1>
      <section className="text-white flex flex-col justify-center gap-7 w-full max-w-xs">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[180px] w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <h2 className="text-lg pb-8 w-full text-center">Sua agenda</h2>
        <Skeleton className="h-[330px] w-full" />
        <Skeleton className="w-full h-auto aspect-video" />
        <Skeleton className="w-full h-5 " />
        <Skeleton className="w-full h-5 " />
        <Skeleton className="w-full h-5 " />
        <Skeleton className="h-10 w-full mb-10" />
      </section>
    </div>
  );
}
