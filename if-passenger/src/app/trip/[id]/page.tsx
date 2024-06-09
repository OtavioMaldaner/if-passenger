import { api } from "@/app/api";
import { single_trip_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function TripPage({ params }: { params: { id: string } }) {
  const id: string = params.id;
  const token = cookies().get("user_token")?.value;

  const trip_request = await api.get(`/trip/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const trip: single_trip_type = trip_request.data;
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
