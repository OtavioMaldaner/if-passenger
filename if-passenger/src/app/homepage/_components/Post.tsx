"use client";
import { trip_type } from "@/app/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, DollarSign, Map, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Post({ post }: { post: trip_type }) {
  const center = { lat: -29.45553697, lng: -51.29300846 };
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAPS ?? "",
    id: "MyMap",
    libraries: ["places"],
  });

  useEffect(() => {
    const fetchDirections = async () => {
      const directionsService = new google.maps.DirectionsService();

      try {
        const results = await directionsService.route({
          origin: post.AddressFrom.name,
          destination: post.AddressTo.name,
          travelMode: google.maps.TravelMode.DRIVING,
          region: "BR", // Região preferencial para a rota
        });
        setDirectionsResponse(results);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();
  }, [post]);

  return (
    <div className="flex flex-col items-center gap-2 max-w-[92%] w-full">
      <Link
        href={`/user/${post.driver.registrationNumber}`}
        className="flex items-center justify-start gap-3 w-full"
      >
        <Image
          src={post.driver.image}
          alt={post.driver.name}
          height={50}
          width={50}
          quality={100}
          className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
        />
        <div className="flex flex-col justify-between">
          <strong>
            <span>{post.driver.name}</span>
          </strong>
          <span>{post.driver.course.name}</span>
        </div>
      </Link>
      <Link
        href={`/trip/${post.id}`}
        className="w-full flex flex-col gap-1 mt-3"
      >
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
                    <DirectionsRenderer directions={directionsResponse} />
                  ) : (
                    <Marker position={center} />
                  )
                }
              </GoogleMap>
            </>
          )}
        </div>
        <div className="grid w-full grid-cols-2 mt-2 gap-[10px]">
          <span className="flex items-center gap-1">
            <MapPin className="text-primary" size={18} />
            {post.AddressFrom.name.split(", ")[1]}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="text-primary" size={18} />
            {format(post.when, "dd ' de 'MMMM', ás 'HH:mm", {
              locale: ptBR,
            })}
          </span>
          <span className="flex items-center gap-1">
            <Map className="text-primary" size={18} />
            {post.AddressTo.name.split(", ")[1]}
          </span>

          <span className="flex items-center gap-1">
            <DollarSign className="text-primary" size={18} />
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(post.price)}{" "}
            / passageiro
          </span>
        </div>
      </Link>
    </div>
  );
}
