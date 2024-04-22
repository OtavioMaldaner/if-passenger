"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Ref, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const formSchema = z.object({});
export default function CreateTripForm() {
  const center = { lat: -29.45553697, lng: -51.29300846 };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {};

  // Pega os valores dos inputs, que irão definir os pontos de saída e chegada
  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);

  // Função para cálculo de rota
  const calculateRoute = async () => {
    if (
      originRef.current?.value === "" ||
      destinationRef.current?.value === ""
    ) {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current?.value,
      destination: destinationRef.current?.value,
      travelMode: google.maps.TravelMode.DRIVING,
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

          <Autocomplete restrictions={{ country: "BR" }}>
            <Input ref={originRef} placeholder="Insira seu local de saída" />
          </Autocomplete>

          <Autocomplete restrictions={{ country: "BR" }}>
            <Input
              ref={destinationRef}
              placeholder="Insira seu local de chegada"
            />
          </Autocomplete>

          <Button onClick={calculateRoute}>Calcular Rota</Button>

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
                  <Marker position={center} />
                  {
                    // Se a rota foi calculada, exibe a rota no mapa
                    directionsResponse && (
                      <DirectionsRenderer
                        directions={directionsResponse}
                        // options={{
                        //   suppressMarkers: true,

                        // }}
                      />
                    )
                  }
                </GoogleMap>

                {distance && (
                  <p className="text-white">Distância: {distance}</p>
                )}
                {duration && <p className="text-white">Duração: {duration}</p>}
              </>
            )}
          </>
        </form>
      </div>
    </Form>
  );
}
