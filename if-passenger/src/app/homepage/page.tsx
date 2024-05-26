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
import { useEffect, useState } from "react";
import { api } from "../api";
import { getDecodedToken } from "../api/functions";
import { JWTToken, trip_type } from "../api/types";
import Feed from "./_components/Feed";
export default function Homepage() {
  const token: JWTToken = getDecodedToken();

  const [selected, setSelected] = useState<string>("following");

  const [data, setData] = useState<trip_type[]>([]);

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

  useEffect(() => {
    fetch(`http://localhost:3333/trips`, {
      headers: {
        Authorization: `Bearer ${Cookie.get("user_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [selected]);
  return (
    <main className="flex flex-col gap-12">
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
      <section>
        <Feed trips={data} />
      </section>
    </main>
  );
}
