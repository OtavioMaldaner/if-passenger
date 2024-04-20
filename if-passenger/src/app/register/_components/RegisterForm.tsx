"use client";
import { api } from "@/app/api";
import { getDecodedToken, salvarTokenNoCookie } from "@/app/api/functions";
import { citiesType, courseType, JWTToken } from "@/app/api/types";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
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
  description: z.string().optional(),
});

export default function RegisterForm({
  cities,
  courses,
}: {
  cities: citiesType[];
  courses: courseType[];
}) {
  const decoded_token: JWTToken = getDecodedToken();
  const router = useRouter();
  if (decoded_token.finishedRegister && Cookie.get("accessedToday") == "true") {
    router.push("/resume");
  } else if (decoded_token.finishedRegister) {
    router.push("/homepage");
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "0",
      course: "",
      registrationNumber: "",
      description: "",
    },
  });

  const hasCity = form.watch("city");
  const hasCourse = form.watch("course");

  const cityId = cities.find((city) => city.nome == hasCity)?.id;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const req = await api.post(
      "/register/user",
      {
        cityId: cityId,
        city: hasCity,
        course: values.course,
        registerNumber: Number(values.registrationNumber),
        description: values.description,
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

  const handleSubmitAndRegisterCar = async (
    values: z.infer<typeof formSchema>
  ) => {
    const req = await api.post(
      "/register/user",
      {
        cityId: cityId,
        city: hasCity,
        course: values.course,
        registerNumber: Number(values.registrationNumber),
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
        router.push("/register/car");
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
  return (
    <Form {...form}>
      <div className="flex w-screen justify-center">
        <form
          className="text-white flex flex-col gap-7 max-w-xs"
          // onSubmit={form.handleSubmit(handleSubmit)}
        >
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
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    placeholder="Insira uma descrição"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between flex-row-reverse">
            <Button onClick={() => handleSubmit(form.getValues())}>
              Enviar
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmitAndRegisterCar(form.getValues())}
            >
              Registrar Veículo
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
