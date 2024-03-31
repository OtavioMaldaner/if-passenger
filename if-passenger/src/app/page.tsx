"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "./api";
import { getDecodedToken, salvarTokenNoCookie } from "./api/functions";
import { JWTToken } from "./api/types";
import { auth } from "./services/auth/firebase";
export default function Home() {
  const router = useRouter();
  const token: JWTToken = getDecodedToken();
  if (token) {
    if (token.finishedRegister == true && Cookies.get("accessedToday")) {
      router.push("/daily");
    }
  }

  const SignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const request = await api.post("/register", {
      name: result.user.displayName,
      email: result.user.email,
      imageUrl: result.user.photoURL,
    });
    if (request.status === 200) {
      const { token } = request.data;
      if (salvarTokenNoCookie(token)) {
        router.push("/register");
      } else {
        toast.error("Erro ao salvar o token de autenticação!", {
          description: "Tente novamente mais tarde e avise um desenvolvedor!",
        });
      }
    } else {
      toast.error("Erro ao autenticar com o Google", {
        description: "Tente novamente mais tarde e avise um desenvolvedor!",
      });
    }
  };

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
          onClick={() => SignInWithGoogle()}
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
