"use client";
import Header from "@/components/default/Header";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import Cookie from "js-cookie";
import { useState } from "react";
import { getDecodedToken } from "../api/functions";
import { JWTToken } from "../api/types";
export default function Homepage() {
  const token: JWTToken = getDecodedToken();

  const [selected, setSelected] = useState<string>("following");

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
  return (
    <main>
      <Header>
        <Select defaultValue="following" onValueChange={(e) => setSelected(e)}>
          <SelectTrigger className="w-[140px] border-0 focus:outline-none">
            <SelectValue>
              {values.find((value) => value.value == selected)?.name ||
                "Seguindo"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {values.map((value) => {
                return (
                  <SelectItem key={value.value} value={value.value}>
                    {value.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Header>
    </main>
  );
}
