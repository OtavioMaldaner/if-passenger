"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Autocomplete,
//   GoogleMap,
//   Marker,
//   useJsApiLoader,
// } from "@react-google-maps/api";
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

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAPS ?? "",
  //   id: "MyMap",
  //   libraries: ["places"],
  // });

  // if (!isLoaded) {
  //   return <Skeleton />;
  // }
  //   const [map, setMap] = useState<google.maps.Map | null>(null);
  return (
    <Form {...form}>
      <div className="flex w-screen justify-center">
        <form
          className="text-white flex flex-col gap-7 w-full max-w-xs"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* <FormField></FormField> */}

          {/* <Autocomplete>
            <Input />
          </Autocomplete> */}

          {/* {!isLoaded ? (
            <Skeleton />
          ) : (
            // <></>
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{
                width: "100%",
                height: "auto",
                aspectRatio: "16/9",
              }}
              //   onLoad={(map) => {
              //     setMap(map);
              //   }}
            >
              <Marker position={center} />
            </GoogleMap>
          )} */}
        </form>
      </div>
    </Form>
  );
}
