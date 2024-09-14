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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../api";
import { getDecodedToken } from "../api/functions";
import { JWTToken, trip_type } from "../api/types";
import Feed from "./_components/Feed";
import HeaderSelectGroup from "./_components/SelectGroup";
export default function Homepage() {
  const token: JWTToken = getDecodedToken();

  const [data, setData] = useState<trip_type[]>([]);

  const selected = useSearchParams().get("filter") ?? "following";

  useEffect(() => {
    fetch(`http://localhost:3333/trips/${selected}`, {
      headers: {
        Authorization: `Bearer ${Cookie.get("user_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [selected]);
  return (
    <main className="flex flex-col gap-12 relative">
      <Header>
        <HeaderSelectGroup token={token} />
      </Header>
      <section className="mt-[250px] z-0">
        <Feed trips={data} />
      </section>
    </main>
  );
}
