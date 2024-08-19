"use client";
import { getDecodedToken } from "@/app/api/functions";
import { daily_trip_type, JWTToken } from "@/app/api/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Cookies from "js-cookie";
import Link from "next/link";
import DailytripComponent from "./DailyTripComponent";

export default function DailtTrips({ trips }: { trips: daily_trip_type[] }) {
  const decodedToken: JWTToken = getDecodedToken();
  Cookies.set("accessed_today", "true");
  let all_cost = 0;

  trips.forEach((trip) => {
    all_cost += trip.price;
  });

  return (
    <section className="flex items-center justify-center flex-col gap-10 max-w-[92%]">
      <section>
        <h1>Seja bem-vindo(a),</h1>
        <h1 className="text-primary text-center">
          {decodedToken.name.split(" ", 1)}
        </h1>
      </section>
      <section>
        <span>
          {format(Date.now(), "dd ' de 'MMMM' de ' yyyy", {
            locale: ptBR,
          })}
        </span>
      </section>
      <section className="text-center">
        {trips.length == 0 ? (
          <>
            <h3>Você não possui viagens no dia de hoje!</h3>
            <Link href="/homepage">Se inscreva em uma viagem na Homepage</Link>
          </>
        ) : trips.length == 1 ? (
          <span>
            No dia de hoje você possui {trips.length} viagem marcada. <br /> O
            valor total gasto em viagens será de R$
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(all_cost)}
            .
          </span>
        ) : (
          <span>
            No dia de hoje você possui {trips.length} viagens marcadas. <br /> O
            valor total gasto em viagens será de R$
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(all_cost)}
            .
          </span>
        )}
      </section>
      <section className="text-center mt-5">
        {trips.map((trip) => {
          return <DailytripComponent trip={trip} key={trip.id} />;
        })}
      </section>
    </section>
  );
}
