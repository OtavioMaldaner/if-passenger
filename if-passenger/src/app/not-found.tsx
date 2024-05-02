import Image from "next/image";
import Link from "next/link";
import logo from "./icon.png";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-24">
      <Image
        src={logo}
        alt="Logo"
        width={200}
        height={200}
        quality={100}
        placeholder="blur"
      />
      <h1 className="text-4xl font-bold text-center">Erro 404</h1>
      <p className="text-lg text-center">Página não encontrada</p>
      <Link href="/homepage" className="text-lg text-blue-500 underline">
        Voltar para a página inicial
      </Link>
    </div>
  );
}
