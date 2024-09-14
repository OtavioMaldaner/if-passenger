import { api } from "@/app/api";
import {
  address_type,
  default_vehicles_type,
  user_car_type,
} from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import CreateTripForm from "./_components/CreateTripForm";

export default async function CreateTrip() {
  const token = cookies().get("user_token")?.value;
  const addressess: address_type[] = await fetch(
    "http://localhost:3333/addresses",
    { method: "GET", headers: { Authorization: `Bearer ${token}` } }
  ).then((res) => res.json());

  let gas_price: number = 0;
  let attempts = 0;
  const maxAttempts = 5;

  while (gas_price === 0 && attempts < maxAttempts) {
    try {
      const request_gas = await api.get("/gas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (request_gas.status == 200 && request_gas.data.price !== undefined) {
        gas_price = request_gas.data.price;
      }
    } catch (error) {
      console.error("Error fetching gas price:", error);
    }

    attempts++;
  }

  const request_car = await api.get("/cars", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const secondary_vehicles_request = await api.get("/default-vehicles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const secondary_vehicles: default_vehicles_type[] =
    secondary_vehicles_request.data;
  const user_cars: user_car_type[] = request_car.data;

  return (
    <main className="flex">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>
      <section className="mt-[110px] flex flex-col items-center justify-center w-full">
        <h1 className="font-bold text-xl pb-8">Criar Viagem</h1>
        <CreateTripForm
          addresses={addressess}
          gas_price={gas_price}
          user_cars={user_cars}
          default_vehicles={secondary_vehicles}
        />
      </section>
    </main>
  );
}
