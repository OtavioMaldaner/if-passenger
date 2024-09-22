"use client";
import { JWTToken } from "@/app/api/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function HeaderSelectGroup({ token }: { token: JWTToken }) {
  const values: { value: string; name: string }[] = [
    {
      value: "following",
      name: "Seguindo",
    },
    {
      value: "city",
      name: token.city,
    },
    {
      value: "course",
      name: token.course,
    },
    {
      value: "in2hours",
      name: "Em 2 horas",
    },
  ];

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Estado para armazenar a seleção atual
  const [selected, setSelected] = useState<string>(
    searchParams.get("filter") || "following"
  );

  // Função que atualiza a seleção e navega com o filtro atualizado
  const handleSelect = (value: string) => {
    setSelected(value);
    const params = new URLSearchParams();
    params.set("filter", value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="flex items-center justify-center gap-3">
          {values
            .find((value) => value.value === selected)
            ?.name.substring(0, 15) || "Seguindo"}{" "}
          <ChevronDown size={18} />
        </span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <h3>Filtros</h3>
          <span>
            O filtro selecionado será utilizado para exibir as viagens
            correspondentes no seu feed.
          </span>
          <span>
            <strong>Apenas um filtro pode ser selecionado por vez.</strong>
          </span>
        </SheetHeader>
        <SheetFooter className="mt-5">
          <div className="flex flex-col gap-3">
            <h4>Categorias:</h4>
            {values.map((value) => (
              <div key={value.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={selected === value.value}
                  onCheckedChange={() => handleSelect(value.value)}
                  id={value.value}
                />
                <label
                  htmlFor={value.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {value.name}
                </label>
              </div>
            ))}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
