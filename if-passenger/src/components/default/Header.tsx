"use client";
import { getDecodedToken, logOut } from "@/app/api/functions";
import { JWTToken } from "@/app/api/types";
import { Bell, Car, Home, Map, PlaneTakeoff, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";

export default function Header({ children }: { children?: React.ReactNode }) {
  const token: JWTToken = getDecodedToken();
  console.log(token);
  const router = useRouter();
  return (
    <header className="flex justify-between items-center p-4 w-full">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src={token.profilePic}
            alt={token.name}
            height={50}
            width={50}
            quality={100}
            className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
          />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <div className="flex gap-3">
              <Image
                src={token.profilePic}
                alt={token.name}
                height={50}
                width={50}
                quality={100}
                className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
              />
              <div className="flex flex-col justify-start items-start">
                <span className="flex items-center text-start">
                  Seja bem-vindo(a), {token.name.split(" ")[0]}
                </span>
                <span
                  onClick={() => {
                    logOut();
                    router.push("/");
                  }}
                  className="text-primary flex items-center"
                >
                  Sair
                </span>
              </div>
            </div>
          </SheetHeader>
          <SheetFooter>
            <div className="flex flex-col mt-7 gap-3">
              <Link className="flex items-center gap-3" href="/homepage">
                <Home className="text-primary" size={18} /> Início
              </Link>
              <Link
                className="flex items-center gap-3"
                href="/user/manage/cars"
              >
                <Car className="text-primary" size={18} /> Gerenciar Veículos
              </Link>
              <Link className="flex items-center gap-3" href="/user/edit">
                <User className="text-primary" size={18} /> Editar Perfil
              </Link>
              <Link className="flex items-center gap-3" href="/user/trips">
                <Map className="text-primary" size={18} /> Minhas Viagens
              </Link>
              <Link className="flex items-center gap-3" href="/notifications">
                <Bell className="text-primary" size={18} /> Notificações
              </Link>
              <Link className="flex items-center gap-3" href="/trips/create">
                <PlaneTakeoff className="text-primary" size={18} /> Criar Viagem
              </Link>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {children}
    </header>
  );
}
