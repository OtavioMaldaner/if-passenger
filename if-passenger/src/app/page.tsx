"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
export default function Home() {
  return (
    <main className="bg-background flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-around h-screen dark:bg-gray-800">
        <h1 className="text-3xl font-sans">IF Passenger</h1>
        <span className="text-center">
          Embarque no melhor aplicativo de caronas do IFRS - Câmpus Feliz
        </span>
        <button className="px-4 py-2 border flex gap-2 bg-slate-200 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
          <Image
            className="w-6 h-6"
            onClick={() => signIn("google")}
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
