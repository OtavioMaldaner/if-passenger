"use client";
import { api } from "@/app/api";
import { getDecodedToken, salvarTokenNoCookie } from "@/app/api/functions";
import { citiesType, courseType, JWTToken } from "@/app/api/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
import { z } from "zod";

const formSchema = z.object({
  city: z.string().refine((value) => value !== "0", {
    message: "A cidade é obrigatória.",
  }),
  course: z.number(),
  description: z.string().optional(),
});

export default function EditProfile({
  courses,
  cities,
}: {
  courses: courseType[];
  cities: citiesType[];
}) {
  const router = useRouter();
  const decoded_token: JWTToken = getDecodedToken();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: String(
        cities.filter((city) => city.nome == decoded_token.city)[0].nome
      ),
      course: Number(
        courses.filter((course) => course.name == decoded_token.course)[0].id
      ),
      description: decoded_token.description ?? "",
    },
  });

  const hasCity = form.watch("city");

  const cityId = cities.find((city) => city.nome == hasCity)?.id;

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    const req = await api.put(
      "/user",
      {
        cityId: cityId,
        course: values.course,
        description: values.description,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get("user_token")}`,
        },
      }
    );
    if (req.status === 200) {
      salvarTokenNoCookie(req.data.token);
      toast(req.data.message);
      router.push("/homepage");
    } else {
      toast(req.data.message);
    }
  };

  const deleteUser = async () => {
    try {
      const req = await api.delete("/user", {
        headers: {
          Authorization: `Bearer ${Cookie.get("user_token")}`,
        },
      });

      // Se a requisição for bem-sucedida (status 200)
      if (req.status === 200) {
        Cookie.remove("user_token"); // Remove o token do cookie
        toast("Usuário deletado com sucesso.");
      }
    } catch (error) {
      if (error.response) {
        toast(error.response.data.message || "Erro ao deletar o usuário.");
      } else {
        toast("Ocorreu um erro. Tente novamente mais tarde.");
      }
    }
  };
  return (
    <Form {...form}>
      <div className="flex w-screen justify-center">
        <form
          className="flex flex-col items-center justify-around"
          onSubmit={form.handleSubmit(handleSubmitForm)}
        >
          <div className="text-white flex flex-col gap-7 max-w-xs w-full">
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
                        <SelectValue placeholder="Selecione a cidade que mais frequenta" />
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
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu curso">
                          {
                            courses.find(
                              (course) =>
                                String(field.value) == String(course.id)
                            )?.name
                          }
                        </SelectValue>
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
          </div>
          <div className="flex flex-col mt-80 gap-4 justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Excluir Perfil</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir o seu perfil?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Ao excluir seu perfil todos
                    os registros da sua conta serão excluídos e não poderão mais
                    ser recuperados!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteUser()}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit">Editar Perfil</Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
