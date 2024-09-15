"use client";
import Feed from "@/components/default/Feed";
import Header from "@/components/default/Header";
import Cookie from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDecodedToken } from "../api/functions";
import { JWTToken, trip_type } from "../api/types";
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
      <section className="mt-[110px] z-0">
        <Feed trips={data} />
      </section>
    </main>
  );
}
