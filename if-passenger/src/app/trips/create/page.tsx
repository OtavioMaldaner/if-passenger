import { api } from "@/app/api";
import { address_type, user_car_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import CreateTripForm from "./_components/CreateTripForm";

export default async function CreateTrip() {
  const token = cookies().get("user_token")?.value;
  const addressess: address_type[] = await fetch(
    "http://localhost:3333/addresses",
    { method: "GET" }
  ).then((res) => res.json());

  const request_gas = await api.get("/gas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const request_car = await api.get("/cars", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user_cars: user_car_type[] = request_car.data;

  let gas_price: number = 0;
  if (request_gas.status == 200 && request_gas.data.price !== undefined) {
    gas_price = request_gas.data.price;
  }

  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>
      <h1 className="font-bold text-xl">Criar Viagem</h1>
      <CreateTripForm
        addresses={addressess}
        gas_price={gas_price}
        user_cars={user_cars}
      />
    </main>
  );
}
