"use client";
import { Button } from "@/components/ui/button";
import { Car, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Question() {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };
  const handleSkip = () => {
    localStorage.setItem("skipCarRegister", "true");
    router.push("/homepage");
  };
  return (
    <main className="flex flex-col gap-20">
      <header>
        <h1 className="font-bold text-2xl p-2">IF Passenger</h1>
      </header>
      <section className="flex flex-col items-center p-5 gap-3">
        <Button
          onClick={handleRegister}
          variant={"outline"}
          className="flex gap-2 items-center justify-center w-full max-w-[300px]"
        >
          <Car className="text-primary" size={18} /> Você deseja registrar um
          carro?
        </Button>
        <Button
          onClick={handleSkip}
          variant={"outline"}
          className="flex gap-2 items-center justify-center w-full max-w-[300px]"
        >
          <ChevronRight className="text-primary" size={18} /> Pular esta etapa
        </Button>
      </section>
    </main>
  );
}
