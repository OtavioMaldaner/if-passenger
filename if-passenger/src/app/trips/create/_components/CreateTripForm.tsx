"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState } from "react";
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

          <Autocomplete
            onPlaceChanged={(e) => {
              console.log(e);
            }}
            restrictions={{ country: "BR" }}
          >
            <Input placeholder="Insira seu local de saída" />
          </Autocomplete>

          <>
            {!isLoaded ? (
              <Skeleton />
            ) : (
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
              </GoogleMap>
            )}
          </>
        </form>
      </div>
    </Form>
  );
}
