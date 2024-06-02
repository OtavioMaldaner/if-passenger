import { api } from "@/app/api";
import { single_trip_type } from "@/app/api/types";
import { cookies } from "next/headers";

export default async function TripPage({ params }: { params: { id: string } }) {
  const id: string = params.id;
  const token = cookies().get("user_token")?.value;

  const trip_request = await api.get(`/trip/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const trip: single_trip_type = trip_request.data;
  console.log(trip_request.statusText);
  return (
    <main>
      <h1>Viagem</h1>
      <p>Viagem com id {id}</p>
    </main>
  );
}
