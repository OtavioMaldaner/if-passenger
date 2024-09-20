"use client";

import { api } from "@/app/api";
import {
  address_type,
  default_vehicles_type,
  user_car_type,
} from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
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
import { Textarea } from "@/components/ui/textarea";
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
import Cookie from "js-cookie";
import { CalendarIcon, Clock2, DollarSign, LandPlot } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  date: z.date().refine(
    (date) => {
      const day = date.getDay();
      return day > 0 && day < 6;
    },
    {
      message: "Você não pode criar uma viagem para o final de semana!",
    }
  ),
  time: z.string(),
  recurrency: z.string().uuid(),
  description: z.string().optional(),
  finalPrice: z.string({
    required_error: "O preço final é obrigatório",
  }),
});
export default function CreateTripForm({
  addresses,
  gas_price,
  user_cars,
  default_vehicles,
  dates,
}: {
  addresses: address_type[];
  gas_price: number;
  user_cars: user_car_type[];
  default_vehicles: default_vehicles_type[];
  dates: Date[];
}) {
  const center = { lat: -29.45553697, lng: -51.29300846 };
  const getInitialDate = () => {
    const today = new Date();
    const day = today.getDay();

    if (day === 6) {
      today.setDate(today.getDate() + 2);
    } else if (day === 0) {
      today.setDate(today.getDate() + 1);
    }

    return today;
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      transportType: "",
      passengers: "",
      date: getInitialDate(),
      time: "06:00",
      recurrency: "",
      description: "",
      finalPrice: "",
    },
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const {
      passengers,
      finalPrice: price,
      date,
      origin,
      destination,
      transportType: vehicle,
      description: notes,
      recurrency: recurrancy,
      time,
    } = values;

    try {
      await api.post(
        "/trip",
        {
          passengers: Number(passengers),
          price: Number(price),
          date,
          origin: Number(
            addresses.find((address) => address.name === origin)?.id
          ),
          destination: Number(
            addresses.find((address) => address.name === destination)?.id
          ),
          vehicle,
          notes,
          recurrancy,
          distance,
          duration,
          time,
          recommendedPrice: Number(calculateRecommendedPrice()?.split(" ")[0]),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("user_token")}`,
          },
        }
      );

      toast.success("Viagem criada com sucesso!");
    } catch (error) {
      toast.error(`Erro ao criar viagem: ${error.message || ""}`);
    }
  };

  function calculateRecommendedPrice() {
    const vehicleId = form.getValues("transportType");
    const isDefaultVehicle = default_vehicles.find(
      (vehicle) => String(vehicle.id) === vehicleId
    );
    const passengers = Number(form.getValues("passengers"));
    const car = user_cars.find((car) => car.id === vehicleId);
    const fuelConsumption = car?.fuelConsumption || 1;
    const distanceInKm = parseFloat(
      distance ? distance.replace(/km|m/g, "") : "0"
    );

    if (!isDefaultVehicle && gas_price > 0) {
      const litter = distanceInKm / fuelConsumption;
      const gasAndMaintenance = gas_price * 4;
      const gasPrice = litter * gasAndMaintenance;
      const fullPrice = gasPrice + tollPrice;
      const price = fullPrice / passengers;
      return Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    }

    return null;
  }

  const [tripDates, setTripDates] = useState<Date[]>([]);

  const recurrency_types = [
    { id: "be072707-5645-4764-94e4-0c211657c4f8", type: "Sem recorrência" },
    { id: "e29bc112-0ddb-46be-8ed0-cffcb142e70e", type: "Nesse dia da semana" },
    { id: "d5d80044-2007-4ddd-bf26-c3f7f7b19532", type: "Todos os dias" },
  ];

  const [tollPrice, setTollPrice] = useState<number>(0);

  // Função para cálculo de rota
  const calculateRoute = async () => {
    if (
      form.getValues("origin") === "" ||
      form.getValues("destination") === ""
    ) {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: form.getValues("origin"),
      destination: form.getValues("destination"),
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAPS ?? "",
    id: "MyMap",
    libraries: ["places"],
  });
  useEffect(() => {
    const origin = form.getValues("origin");
    const destination = form.getValues("destination");
    if (
      origin !== form.control._defaultValues.origin &&
      destination !== form.control._defaultValues.destination
    ) {
      calculateRoute();
    }
  }, [form.watch("origin"), form.watch("destination")]);

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
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={8}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    placeholder="Insira a descrição da viagem (opcional)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
                      onSelect={(date) => {
                        field.onChange(date);
                        setTripDates((prevTripDates) => [
                          ...prevTripDates,
                          new Date(date ?? ""),
                        ]);
                      }}
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
                <FormDescription>
                  Neste campo você deve selecionar a data da viagem. Não será
                  possível criar viagens para o final de semana!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="time"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <Input
                    type="time"
                    onSelect={(time) => {
                      field.onChange(time);
                    }}
                    min="06:00"
                    max="22:30"
                    placeholder="Selecione a hora de saída da viagem"
                    className="bg-transparent"
                  />
                </FormControl>
                <FormDescription>
                  Neste campo você deve inserir a hora de saída da viagem. A
                  hora inicial que pode ser selecionada é 06:00 e a hora final é
                  22:30.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="recurrency"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                    const date = new Date(form.getValues("date"));
                    setTripDates([date]);
                    const dateInTwoWeeks = new Date(date);
                    dateInTwoWeeks.setDate(date.getDate() + 14);
                    if (e === recurrency_types[1].id) {
                      const dayOfWeek = date.getDay();
                      for (
                        let d = new Date(date);
                        d < dateInTwoWeeks;
                        d.setDate(d.getDate() + 1)
                      ) {
                        const currentDate = new Date(d);
                        if (currentDate.getDay() === dayOfWeek) {
                          setTripDates((prevDates) => [
                            ...prevDates,
                            currentDate,
                          ]);
                        }
                      }
                    } else if (e === recurrency_types[2].id) {
                      while (date < dateInTwoWeeks) {
                        const currentDate = new Date(date);
                        if (
                          currentDate.getDay() !== 0 &&
                          currentDate.getDay() !== 6
                        ) {
                          setTripDates((prevDates) => [
                            ...prevDates,
                            currentDate,
                          ]);
                        }
                        date.setDate(date.getDate() + 1);
                      }
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:outline-none">
                      <SelectValue placeholder="Selecione a recorrência">
                        {
                          recurrency_types.find(
                            (recurrency) => recurrency.id === field.value
                          )?.type
                        }
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {recurrency_types.map((recurrency) => {
                        return (
                          <SelectItem key={recurrency.id} value={recurrency.id}>
                            {recurrency.type}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Se você realiza essa viagem regularmente, esta opção é para
                  você. Aqui, você pode escolher se deseja criar a viagem apenas
                  para o dia da semana selecionado ou para todos os dias. A
                  viagem será automaticamente criada seguindo essa regra por{" "}
                  <strong>duas semanas</strong>. Isso significa que você não
                  precisará se preocupar em inserir os detalhes da viagem
                  repetidamente durante esse período.
                </FormDescription>
              </FormItem>
            )}
          />

          <h2 className="text-lg pb-8 w-full text-center">Sua agenda</h2>

          <div className="flex flex-col items-center justify-center">
            <Card>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={[...tripDates, ...dates]}
                  disabled={(date) => {
                    const dayOfWeek = date.getDay();
                    return dayOfWeek === 0 || dayOfWeek === 6;
                  }}
                  locale={ptBR}
                />
              </CardContent>
            </Card>
          </div>

          <>
            {form.getValues("origin") == "" &&
            form.getValues("destination") == "" ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="w-full h-auto aspect-video" />
                <Skeleton className="w-full h-5 " />
                <Skeleton className="w-full h-5 " />
                <Skeleton className="w-full h-5 " />
              </div>
            ) : (
              <>
                <GoogleMap
                  center={center}
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
                <>
                  {distance &&
                    form.getValues("passengers") !==
                      form.control._defaultValues.passengers &&
                    form.getValues("transportType") !==
                      form.control._defaultValues.passengers && (
                      <>
                        <p className="flex items-center gap-3">
                          <LandPlot className="text-primary" size={18} />{" "}
                          <span className="text-white">
                            {" "}
                            Distância: {distance}
                          </span>
                        </p>
                        {!default_vehicles.find(
                          (vehicle) =>
                            String(vehicle.id) ===
                            form.getValues("transportType")
                        ) &&
                          gas_price > 0 && (
                            <p className="flex items-center gap-3">
                              <DollarSign className="text-primary" size={18} />{" "}
                              <span className="text-white">
                                Preço mínimo recomendado por passageiro:{" "}
                                {calculateRecommendedPrice()}
                              </span>
                            </p>
                          )}
                      </>
                    )}
                  {duration && (
                    <p className="flex items-center gap-3">
                      <Clock2 className="text-primary" size={18} />{" "}
                      <span className="text-white">Duração: {duration}</span>
                    </p>
                  )}
                </>
              </>
            )}
          </>

          <FormField
            name="finalPrice"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    inputMode="decimal"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    placeholder="Insira o preço final da viagem"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="mb-10" type="submit">
            Criar viagem
          </Button>
        </form>
      </div>
    </Form>
  );
}
