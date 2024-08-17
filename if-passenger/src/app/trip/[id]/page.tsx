import { api } from "@/app/api";
import { single_trip_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Trip from "./_components/Trip";

export default async function TripPage({ params }: { params: { id: string } }) {
  const id: string = params.id;
  const token = cookies().get("user_token")?.value;

  const trip_request = await api.get(`/trip/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user_trip_request = await api.get(`/tripRequests/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user_requested = user_trip_request.data;

  const trip: single_trip_type = trip_request.data;

  return (
    <main className="flex flex-col gap-7">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>

      <section className="flex flex-col items-center justify-center w-full">
        <Trip trip={trip} userRequested={user_requested} />
      </section>
    </main>
  );
}
