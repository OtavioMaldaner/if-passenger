"use client";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  brand: z.number(),
  model: z.number(),
});

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: 0,
      model: 0,
    },
  });

  const handleSubmit = () => {};
  return (
    <main className="flex flex-col gap-5">
      <header>
        <h1 className="font-bold text-2xl p-2">IF Passenger</h1>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            name="brand"
            control={form.control}
            render={({ field }) => {
              return <FormItem></FormItem>;
            }}
          />
        </form>
      </Form>
    </main>
  );
}
