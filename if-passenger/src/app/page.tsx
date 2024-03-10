"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "authenticated" &&
      window.localStorage.getItem("skipCarRegister") === "true"
    ) {
      router.push("/homepage");
    } else if (status === "authenticated") {
      router.push("/question");
    }
  }, [status, data]);

  return (
    <main className="bg-background flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-around h-screen dark:bg-gray-800">
        <h1 className="text-3xl font-sans font-bold">IF Passenger</h1>
        <div className="flex flex-col gap-4 text-center px-5">
          <span>
            Junte-se à comunidade IF Passenger e transforme sua rotina escolar
            em uma jornada colaborativa e econômica.
          </span>
          <span>
            Inscreva-se agora e comece a economizar enquanto conecta com outros
            estudantes!
          </span>
        </div>
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 border flex gap-2 bg-slate-200 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
        >
          <Image
            className="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            quality={100}
            width={24}
            height={24}
            alt="google logo"
          />
          <span>Entrar com Google</span>
        </button>
      </div>
    </main>
  );
}
