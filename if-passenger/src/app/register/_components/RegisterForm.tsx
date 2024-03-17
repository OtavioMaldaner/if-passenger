"use client";
import { api } from "@/app/api";
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
  city: z.string().refine((value) => value !== "0", {
    message: "A cidade é obrigatória.",
  }),
  course: z.string().uuid(),
  registrationNumber: z
    .string()
    .max(10, "A matrícula deve ter 10 dígitos")
    .min(10, "A matrícula deve ter 10 dígitos")
    .refine((value) => /^[0-9]{10}$/i.test(value), {
      message: "A matrícula deve conter 10 dígitos numéricos!",
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

export default function RegisterForm({
  brands,
  cities,
  courses,
}: {
  brands: carsType[];
  cities: citiesType[];
  courses: courseType[];
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "0",
      model: "0",
      licensePlate: undefined,
      city: "0",
      course: "",
      registrationNumber: "",
      capacity: "0",
    },
  });

  const hasBrand = form.watch("brand");
  const hasModel = form.watch("model");
  const hasCity = form.watch("city");
  const hasCourse = form.watch("course");

  const cityId = cities.find((city) => city.nome == hasCity)?.id;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const req = await api.post(
      "/register/complement",
      {
        brand: userCar.brand,
        model: userCar.model,
        licensePlate: values.licensePlate,
        cityId: cityId,
        city: hasCity,
        course: values.course,
        registerNumber: Number(values.registrationNumber),
        passengers: Number(values.capacity),
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get("user_token")}`,
        },
      }
    );
    console.log({ values });
    if (req.status === 200 || req.status === 201) {
      toast("Cadastro realizado com sucesso!");
      router.push("/homepage");
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
          <FormField
            name="course"
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
                      {hasCourse && hasCourse != "" ? (
                        <SelectValue>
                          {
                            courses.find((course) => field.value == course.id)
                              ?.name
                          }
                        </SelectValue>
                      ) : (
                        <SelectValue>Selecione seu curso</SelectValue>
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="registrationNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    placeholder="Insira o seu número de matrícula"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </Form>
  );
}
