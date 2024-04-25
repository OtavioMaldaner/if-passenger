"use client";

import { address_type } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Ref, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const formSchema = z.object({});
export default function CreateTripForm({
  addresses,
}: {
  addresses: address_type[];
}) {
  const center = { lat: -29.45553697, lng: -51.29300846 };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {};

  // Pega os valores dos inputs, que irão definir os pontos de saída e chegada
  // const originRef = useRef<HTMLInputElement | null>(null);
  // const destinationRef = useRef<HTMLInputElement | null>(null);

  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  // Função para cálculo de rota
  const calculateRoute = async () => {
    if (origin === "" || destination === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      language: "pt-BR",
    });
    setDirectionsResponse(results);
    setDistance(
      results.routes[0].legs[0].distance?.text ??
        "Não obtivemos uma estimativa de distância da viagem"
    );
    setDuration(
      results.routes[0].legs[0].duration?.text ??
        "Não obtivemos uma estimativa de duração da viagem"
    );
    console.log(results);
  };

  // Estados para armazenar o mapa, a resposta da rota, a distância e a duração
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  // const [trip, setTrip] = useState<{from: }>

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAPS ?? "",
    id: "MyMap",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <Skeleton />;
  }

  return (
    <Form {...form}>
      <div className="flex w-screen justify-center">
        <form
          className="text-white flex flex-col gap-7 w-full max-w-xs"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* <FormField></FormField> */}

          <Select onValueChange={(e) => setOrigin(e)}>
            <SelectTrigger className="focus:outline-none">
              <SelectValue>
                {addresses.some((address) => address.name == origin)
                  ? origin
                  : "Local de saída"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {addresses.map((address) => {
                  return (
                    <SelectItem key={address.id} value={address.name}>
                      {address.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={(e) => setDestination(e)}>
            <SelectTrigger className="focus:outline-none">
              <SelectValue>
                {addresses.some((address) => address.name == origin)
                  ? origin
                  : "Local de chegada"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {addresses.map((address) => {
                  return (
                    <SelectItem key={address.id} value={address.name}>
                      {address.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* <Button onClick={calculateRoute}>Calcular Rota</Button> */}
          {/* 
          <>
            {!isLoaded ? (
              <Skeleton />
            ) : (
              <>
                <GoogleMap
                  center={center}
                  zoom={15}
                  mapContainerStyle={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "16/9",
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
                      <DirectionsRenderer directions={directionsResponse} />
                    ) : (
                      <Marker position={center} />
                    )
                  }
                </GoogleMap>

                {distance && (
                  <p className="text-white">Distância: {distance}</p>
                )}
                {duration && <p className="text-white">Duração: {duration}</p>}
              </>
            )}
          </> */}
        </form>
      </div>
    </Form>
  );
}
