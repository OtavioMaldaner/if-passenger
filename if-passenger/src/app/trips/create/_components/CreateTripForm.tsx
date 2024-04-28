"use client";

import {
  address_type,
  default_vehicles_type,
  user_car_type,
} from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Link } from "lucide-react";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const formSchema = z.object({
  origin: z.string({
    required_error: "O local de saída é obrigatório",
  }),
  destination: z.string({
    required_error: "O local de chegada é obrigatório",
  }),
  transportType: z.string({
    required_error: "O meio de transporte é obrigatório",
  }),
  passengers: z.string().refine(
    (value) => {
      const numberValue = Number(value);
      return numberValue > 0 && numberValue < 7;
    },
    {
      message: "A capacidade deve ser um número positivo menor que 7.",
    }
  ),
  date: z.date(),
  isRecurrent: z.boolean().default(false).optional(),
});
export default function CreateTripForm({
  addresses,
  gas_price,
  user_cars,
  default_vehicles,
}: {
  addresses: address_type[];
  gas_price: number;
  user_cars: user_car_type[];
  default_vehicles: default_vehicles_type[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      transportType: "",
      passengers: "",
      date: new Date(),
      isRecurrent: false,
    },
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {};

  const [tollPrice, setTollPrice] = useState<number>(0);

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
  };

  // Estados para armazenar o mapa, a resposta da rota, a distância e a duração
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

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
          <FormField
            name="origin"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:outline-none">
                      <SelectValue placeholder="Local de saída" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {addresses.map((address) => {
                      return (
                        <SelectItem key={address.id} value={address.name}>
                          {address.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="destination"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(e) => field.onChange(e)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:outline-none">
                      <SelectValue placeholder="Local de chegada" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {addresses.map((address) => {
                      return (
                        <SelectItem key={address.id} value={address.name}>
                          {address.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="transportType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(e) => field.onChange(e)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:outline-none">
                      <SelectValue placeholder="Meio de transporte">
                        {user_cars.find((car) => car.id === field.value)
                          ? user_cars.find((car) => car.id === field.value)
                              ?.brand +
                            " " +
                            user_cars.find((car) => car.id === field.value)
                              ?.model
                          : default_vehicles.find(
                              (vehicle) => String(vehicle.id) === field.value
                            )?.name}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {user_cars.map((car) => {
                        return (
                          <SelectItem key={car.id} value={car.id}>
                            {car.brand + " " + car.model}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                    <SelectGroup>
                      {default_vehicles.map((vehicle) => {
                        return (
                          <SelectItem
                            key={vehicle.id}
                            value={String(vehicle.id)}
                          >
                            {vehicle.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            name="passengers"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    placeholder="Insira a quantidade de passageiros"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 items-center justify-center">
            <Input
              disabled
              placeholder="Selecione um motorista reserva (opcional)"
            />
            <p className="text-sm text-muted-foreground pl-1">
              É possível selecionar um motorista reserva caso ocorra alguma
              emergência e você não possa dirigir.
            </p>
          </div>

          <Input
            placeholder="Insira o valor gasto em pedágios (opcional)"
            type="number"
            inputMode="decimal"
            onChange={(e) => {
              setTollPrice(Number(e.target.value));
            }}
          />

          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "EEEE', 'dd ' de 'MMMM", {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione a data da viagem</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const dayOfWeek = date.getDay();
                        return (
                          dayOfWeek === 0 ||
                          dayOfWeek === 6 ||
                          date < new Date()
                        );
                      }}
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isRecurrent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 border-primary p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Esta viagem é recorrente?</FormLabel>
                  <FormDescription>
                    Se você realiza essa viagem regularmente, esta opção é para
                    você. Ao selecioná-la, a viagem será criada automaticamente
                    para todos os dias durante <strong>duas semanas</strong>.
                    Assim, você não precisará se preocupar em inserir os
                    detalhes da viagem repetidamente.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <h2 className="text-lg pb-8 w-full text-center">Sua agenda</h2>

          {/* )}
          /> */}

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
