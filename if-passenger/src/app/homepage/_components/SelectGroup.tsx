"use client";
import { JWTToken } from "@/app/api/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const selected = searchParams.get("filter") || "following";

  const setSelected = (value: string) => {
    const params = new URLSearchParams();
    params.set("filter", value);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Select defaultValue={selected} onValueChange={setSelected}>
      <SelectTrigger className="w-[140px] border-0 focus:outline-none">
        <SelectValue>
          {values.find((value) => value.value === selected)?.name || "Seguindo"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {values.map((value) => (
            <SelectItem key={value.value} value={value.value}>
              {value.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
