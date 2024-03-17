"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { carsType, citiesType } from "../page";

const formSchema = z.object({
  brand: z.string().refine((value) => value !== "0", {
    message: "A marca é obrigatória.",
  }),
  model: z.string().refine((value) => value !== "0", {
    message: "O modelo é obrigatório.",
  }),
  licensePlate: z
    .string()
    .max(7, "A placa deve ter 7 dígitos")
    .min(7, "A placa deve ter 7 dígitos")
    .refine((value) => /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i.test(value), {
      message: "A placa deve seguir o formato AAA9A99",
    }),
  city: z.string().refine((value) => value !== "0", {
    message: "A cidade é obrigatória.",
  }),
});

export default function RegisterForm({
  brands,
  cities,
}: {
  brands: carsType[];
  cities: citiesType[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "0",
      model: "0",
      licensePlate: undefined,
      city: "0",
    },
  });

  const hasBrand = form.watch("brand");
  const hasModel = form.watch("model");
  const hasCity = form.watch("city");

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
  };

  const [userCar, setUserCar] = useState<{
    brand: string;
    model: string;
  }>({ brand: "", model: "" });

  const [models, setModels] = useState<carsType[]>([]);

  useEffect(() => {
    fetch(
      `https://parallelum.com.br/fipe/api/v1/carros/marcas/${hasBrand}/modelos`
    )
      .then((res) => res.json())
      .then((data) => setModels(data.modelos));
  }, [hasBrand]);

  return (
    <Form {...form}>
      <form className="text-white" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="brand"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(value) => {
                  field.onChange({ target: { value } });
                  const selectedBrand = brands.find(
                    (brand) => brand.codigo == value
                  );
                  if (selectedBrand) {
                    setUserCar({ brand: selectedBrand.nome, model: "" });
                  }
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    {hasBrand && hasBrand != "0" ? (
                      <SelectValue>{userCar.brand}</SelectValue>
                    ) : (
                      <SelectValue>Selecione a marca do seu carro</SelectValue>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.codigo} value={brand.codigo}>
                      {brand.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="model"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Select
                disabled={!hasBrand || hasBrand == "0"}
                onValueChange={(value) => {
                  field.onChange({ target: { value } });
                  const selectedModel = models.find(
                    (model) => model.codigo == value
                  );
                  if (selectedModel) {
                    setUserCar({ ...userCar, model: selectedModel.nome });
                  }
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    {hasModel && hasModel != "0" && userCar.model !== "" ? (
                      <SelectValue>{userCar.model}</SelectValue>
                    ) : (
                      <SelectValue>Selecione o modelo do seu carro</SelectValue>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models &&
                    models.map((model) => (
                      <SelectItem key={model.codigo} value={model.codigo}>
                        {model.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="licensePlate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    field.onChange(e);
                  }}
                  placeholder="Insira a placa do seu carro"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(value) => {
                  field.onChange({ target: { value } });
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    {hasCity && hasCity != "0" ? (
                      <SelectValue>{field.value}</SelectValue>
                    ) : (
                      <SelectValue>
                        Selecione a cidade que mais frequenta
                      </SelectValue>
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.nome}>
                      {city.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
