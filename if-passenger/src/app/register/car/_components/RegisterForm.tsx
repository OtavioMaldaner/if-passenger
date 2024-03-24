"use client";
import { api } from "@/app/api";
import { salvarTokenNoCookie } from "@/app/api/functions";
import { carsType, citiesType, courseType } from "@/app/api/types";
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
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
  capacity: z.string().refine(
    (value) => {
      const numberValue = Number(value);
      return numberValue > 0 && numberValue < 7;
    },
    {
      message: "A capacidade deve ser um número positivo menor que 7.",
    }
  ),
});

export default function RegisterForm({ brands }: { brands: carsType[] }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "0",
      model: "0",
      licensePlate: undefined,
      capacity: "",
    },
  });

  const hasBrand = form.watch("brand");
  const hasModel = form.watch("model");

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const req = await api.post(
      "/register/car",
      {
        brand: userCar.brand,
        model: userCar.model,
        licensePlate: values.licensePlate,
        passengers: Number(values.capacity),
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get("user_token")}`,
        },
      }
    );
    if (req.status === 200 || req.status === 201) {
      toast("Cadastro realizado com sucesso!");
      const { token } = req.data;
      if (salvarTokenNoCookie(token)) {
        router.push("/homepage");
      } else {
        toast.error("Erro ao salvar o token de autenticação!", {
          description: "Tente novamente mais tarde e avise um desenvolvedor!",
        });
      }
    } else {
      toast.error("Erro ao realizar o cadastro!", {
        description: "Tente novamente mais tarde e avise um desenvolvedor!",
      });
    }
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
      <div className="flex w-screen justify-center">
        <form
          className="text-white flex flex-col gap-7 max-w-xs"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
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
                        <SelectValue>
                          Selecione a marca do seu carro
                        </SelectValue>
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
                        <SelectValue>
                          Selecione o modelo do seu carro
                        </SelectValue>
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
            name="capacity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    placeholder="Insira a capacidade do seu carro"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Input disabled placeholder="Insira a média de consumo em Km/L" />
          <Input disabled placeholder="Selecione o tipo de combustível" />
          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </Form>
  );
}
