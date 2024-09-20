"use client";
import { api } from "@/app/api";
import { getDecodedToken } from "@/app/api/functions";
import { JWTToken, single_trip_type } from "@/app/api/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Cookies from "js-cookie";
import { Car, Clock, DollarSign, Map, MapPin, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Trip({
  trip,
  userRequested,
}: {
  trip: single_trip_type;
  userRequested: {
    requested: boolean;
    accepted: boolean;
    deletedAt: Date | null;
  };
}) {
  const router = useRouter();

  const token: string | undefined = Cookies.get("user_token");
  const decoded_token: JWTToken = getDecodedToken();
  const center = { lat: -29.45553697, lng: -51.29300846 };
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAPS ?? "",
    id: "MyMap",
    libraries: ["places"],
  });

  const requestRide = async () => {
    try {
      const request = await api.post(
        "/tripRequests",
        {
          tripId: trip.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (request.status == 200 || request.status == 201) {
        toast("Solicitação de carona enviada com sucesso", {
          description: `Aguarde a resposta de ${trip.driver.name} para adicionar a viagem em sua agenda!`,
        });
      }
    } catch (e) {
      toast("Erro ao pedir carona! Tente novamente mais tarde!");
    }
  };

  const cancelRide = async () => {
    try {
      const passengerId = trip.passengers
        .filter((passenger) => passenger.User?.id === decoded_token.sub)
        .map((passenger) => passenger.id)[0];

      const request = await api.delete(`/ride/${passengerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (request.status == 200 || request.status == 201) {
        toast("Carona cancelada com sucesso!");
      }
    } catch (e) {
      toast("Erro ao cancelar a carona! Tente novamente mais tarde!");
    }
  };

  const deleteTrip = async () => {
    try {
      const request = await api.post(
        "/trip/delete",
        {
          tripId: trip.id,
        },
        {
          headers: {
            Authorization: `Bearer ${decoded_token}`,
          },
        }
      );
      if (request.status == 200 || request.status == 201) {
        toast("Viagem excluída com sucesso!");
        router.push("/homepage");
      }
    } catch (e) {
      toast("Erro ao excluir viagem! Tente novamente mais tarde!");
    }
  };

  useEffect(() => {
    if (!isLoaded) return; // Aguarde até que a biblioteca do Google Maps seja carregada

    const fetchDirections = async () => {
      const directionsService = new google.maps.DirectionsService();

      try {
        const results = await directionsService.route({
          origin: trip.AddressFrom.name,
          destination: trip.AddressTo.name,
          travelMode: google.maps.TravelMode.DRIVING,
          region: "BR", // Região preferencial para a rota,
          provideRouteAlternatives: true,
        });
        setDirectionsResponse(results);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();

    // Função de limpeza (opcional, mas boa prática)
    return () => {
      setDirectionsResponse(null); // ou qualquer outra limpeza necessária
    };
  }, [isLoaded, trip]); // Adicione `isLoaded` como dependência

  return (
    <div className="flex flex-col items-center gap-2 max-w-[92%] w-full">
      <Link
        href={`/user/${trip.driver.registrationNumber}`}
        className="flex items-center justify-start gap-3 w-full"
      >
        <Image
          src={trip.driver.image}
          alt={trip.driver.name}
          height={50}
          width={50}
          quality={100}
          className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
        />
        <div className="flex flex-col justify-between">
          <strong>
            <span>{trip.driver.name}</span>
          </strong>
          <span>{trip.driver.course.name}</span>
        </div>
      </Link>
      <section className="w-full flex flex-col gap-1 mt-3">
        <div>
          {!isLoaded ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="w-full h-auto aspect-video" />
            </div>
          ) : (
            <>
              <GoogleMap
                zoom={15}
                mapContainerStyle={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "16/9",
                  borderRadius: "11px",
                }}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={(map) => {
                  setMap(map);
                }}
              >
                {
                  // Se a rota foi calculada, exibe a rota no mapa
                  directionsResponse ? (
                    <DirectionsRenderer
                      directions={directionsResponse}
                      routeIndex={1}
                    />
                  ) : (
                    <Marker position={center} />
                  )
                }
              </GoogleMap>
            </>
          )}
        </div>
        {!userRequested.accepted ? (
          <div className="grid w-full grid-cols-2 mt-2 gap-[10px]">
            <span className="flex items-center gap-1">
              <MapPin className="text-primary" size={18} />
              {trip.AddressFrom.name.split(", ")[1]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="text-primary" size={18} />
              {format(trip.when, "dd ' de 'MMMM', ás 'HH:mm", {
                locale: ptBR,
              })}
            </span>
            <span className="flex items-center gap-1">
              <Map className="text-primary" size={18} />
              {trip.AddressTo.name.split(", ")[1]}
            </span>

            <span className="flex items-center gap-1">
              <DollarSign className="text-primary" size={18} />
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(trip.price))}{" "}
              / passageiro
            </span>

            {trip.driver.id != decoded_token.sub && (
              <span className="flex items-center gap-1">
                <Users2 className="text-primary" size={18} />
                <div className="flex flex-col">
                  <span>
                    Máx:{" "}
                    {trip.maxPassengers != 1 ? (
                      <>{trip.maxPassengers} passageiros</>
                    ) : (
                      <>{trip.maxPassengers} passageiro</>
                    )}
                  </span>
                  <span className="whitespace-nowrap">
                    Atual:{" "}
                    {trip.passengers.length > 1 ? (
                      <>{trip.passengers.length} passageiros</>
                    ) : trip.passengers.length == 1 ? (
                      <>{trip.passengers.length} passageiro</>
                    ) : (
                      <>Sem passageiros</>
                    )}
                  </span>
                </div>
              </span>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-col w-full mt-2 gap-[10px]">
              <span className="flex items-center gap-1">
                <MapPin className="text-primary" size={18} />
                {trip.AddressFrom.name.replace(", Brazil", "")}
              </span>
              <span className="flex items-center gap-1">
                <Map className="text-primary" size={18} />
                {trip.AddressTo.name.replace(", Brazil", "")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="text-primary" size={18} />
                {format(trip.when, "dd ' de 'MMMM', ás 'HH:mm", {
                  locale: ptBR,
                })}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="text-primary" size={18} />
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(trip.price))}{" "}
                / passageiro
              </span>
              <span className="flex items-center gap-1">
                <Car className="text-primary" size={18} />
                {trip.car?.brand}{" "}
                {trip.car?.model.replace(/(^\w{1})|(\s+\w{1})/g, (letra) =>
                  letra.toUpperCase()
                )}
                , {trip.car?.licensePlate}
              </span>
            </div>
            <div className="flex justify-end">
              <div style={{ width: `${trip.passengers.length * 40 + 40}px` }}>
                <div className="flex relative">
                  <Link
                    href={`/user/${trip.driver.registrationNumber}`}
                    className="rounded-full max-w-[40px]"
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
                        className={`rounded-full shadow-[-5px_0px_0px_1px_#09090B] max-w-[40px] absolute`}
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
        )}
        <div className="w-full flex justify-center flex-col mt-5">
          {trip.notes ? (
            <div>
              <h3 className="text-[18px]">Observações:</h3>
              <div className="flex flex-col">
                {trip.notes.split("\n").map((paragraph, index) => {
                  return (
                    <span className="text-[14px]" key={index}>
                      {paragraph}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-[18px]">Observações:</h3>
              <span className="text-[#ffffff7a] text-[14px]">
                Sem Observações
              </span>
            </div>
          )}

          {new Date(trip.when) > new Date() ? (
            <div className="mt-10 w-full flex justify-center items-center">
              <div className="w-full">
                {trip.driver.id == decoded_token.sub ? (
                  <div className="flex flex-col justify-center items-center gap-8">
                    <div className="w-full flex flex-col gap-4">
                      <div className="w-full">
                        <h3>Passageiros:</h3>
                      </div>
                      {trip.passengers.map((passenger) => {
                        return (
                          <div>
                            <Link
                              href={`/user/${passenger.User?.registrationNumber}`}
                              key={passenger.User?.id}
                              className="w-full flex gap-3"
                            >
                              <Image
                                src={passenger.User?.image ?? ""}
                                alt={passenger.User?.name ?? ""}
                                width={50}
                                height={50}
                                quality={100}
                                className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
                              />
                              <div className="flex flex-col justify-between">
                                <span>
                                  <strong>{passenger.User?.name}</strong>
                                </span>
                                <span>{passenger.User?.course.name}</span>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <Button variant="secondary" disabled>
                        Adicionar Motorista Reserva
                      </Button>
                    </div>
                    <div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant={"destructive"}>
                            Excluir viagem
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Tem certeza que deseja excluir a viagem?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Os caroneiros
                              serão comunicados da sua decisão, mas lembre de
                              avisá-los novamente e evitar possíveis transtornos
                              futuros!
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTrip()}>
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ) : (
                  <>
                    {!userRequested.requested ? (
                      <Button onClick={() => requestRide()}>
                        Pedir carona
                      </Button>
                    ) : (
                      <>
                        {userRequested.requested && userRequested.accepted ? (
                          <Button
                            variant="destructive"
                            onClick={() => cancelRide()}
                          >
                            Cancelar Carona
                          </Button>
                        ) : (
                          <Button variant="ghost">Aguardando Resposta</Button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4 mt-4">
              <div className="w-full">
                <h3>Passageiros:</h3>
              </div>
              {trip.passengers.map((passenger) => {
                return (
                  <div>
                    <Link
                      href={`/user/${passenger.User?.registrationNumber}`}
                      key={passenger.User?.id}
                      className="w-full flex gap-3"
                    >
                      <Image
                        src={passenger.User?.image ?? ""}
                        alt={passenger.User?.name ?? ""}
                        width={50}
                        height={50}
                        quality={100}
                        className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
                      />
                      <div className="flex flex-col justify-between">
                        <span>
                          <strong>{passenger.User?.name}</strong>
                        </span>
                        <span>{passenger.User?.course.name}</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
