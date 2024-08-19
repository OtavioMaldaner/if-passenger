import { daily_trip_type } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Car, Clock, DollarSign, Map, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DailytripComponent({
  trip,
}: {
  trip: daily_trip_type;
}) {
  return (
    <Card>
      <CardContent>
        <span className="flex items-center gap-3">
          <MapPin className="text-primary" size={18} />
          <span>
            {trip.AddressFrom.name.replace(", Brazil", "").replace(" - RS", "")}
          </span>
        </span>
        <span className="flex items-center gap-3">
          <Map className="text-primary" size={18} />
          <span>
            {trip.AddressTo.name.replace(", Brazil", "").replace(" - RS", "")}
          </span>
        </span>
        <span className="flex items-center gap-3">
          <Clock className="text-primary" size={18} />
          <span>
            {format(trip.when, "HH:mm", {
              locale: ptBR,
            })}
          </span>
        </span>
        <span className="flex items-center gap-3">
          <DollarSign className="text-primary" size={18} />
          <span>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(trip.price))}{" "}
            / passageiro
          </span>
        </span>
        {trip.DifferentVehicles != null ? (
          <span className="flex items-center gap-3">
            <Car className="text-primary" size={18} />
            {trip.DifferentVehicles.name}
          </span>
        ) : (
          <span className="flex items-center text-start gap-3">
            <Car className="text-primary" size={18} />
            {trip.car?.brand}{" "}
            {trip.car?.model
              .substring(0, 15)
              .concat("...")
              .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase())}
            , {trip.car?.licensePlate}
          </span>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Link href={`/trip/${trip.id}`}>
            <Button>Visualizar</Button>
          </Link>
          <div className="flex justify-end">
            <div
              style={{
                width: `${trip.passengers.length * 40 + 40}px`,
                position: "relative",
              }}
            >
              <div className="flex">
                <Link
                  href={`/user/${trip.driver.registrationNumber}`}
                  className="rounded-full z-10 relative shadow-[3px_0px_0px_1px_#09090B] max-w-[40px]"
                >
                  <Image
                    className="w-full rounded-full"
                    key={trip.driver.id}
                    src={trip.driver.image ?? ""}
                    alt={trip.driver.name ?? ""}
                    width={40}
                    height={40}
                    quality={100}
                  />
                </Link>
                {trip.passengers.map((passenger, index) => {
                  return (
                    <Link
                      href={`/user/${passenger.User?.registrationNumber}`}
                      className={`rounded-full shadow-[3px_0px_0px_1px_#09090B] max-w-[40px] absolute`}
                      style={{ left: `${(index + 1) * 32}px` }}
                    >
                      <Image
                        className="w-full rounded-full"
                        key={passenger.id}
                        src={passenger.User?.image ?? ""}
                        alt={passenger.User?.name ?? ""}
                        width={40}
                        height={40}
                        quality={100}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
