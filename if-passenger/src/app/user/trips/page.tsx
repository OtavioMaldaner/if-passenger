import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function UserTrips() {
  return (
    <main>
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>
    </main>
  );
}
