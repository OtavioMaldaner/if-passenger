import { api } from "@/app/api";
import { follow_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Following({
  params,
}: {
  params: { registrationNumber: string };
}) {
  const registrationNumber: string = params.registrationNumber;
  const token = cookies().get("user_token")?.value;

  const userRequest = await api.get(`/following/${registrationNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const followers: follow_type[] = userRequest.data.following;

  return (
    <main>
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href={`/user/${registrationNumber}`}
        >
          <ChevronLeft size={18} /> Página Anterior
        </Link>
      </Header>
      <section className="flex flex-col items-center gap-9">
        <h1 className="text-2xl">Seguindo</h1>
        <div className="flex flex-col items-center gap-9">
          {followers ? (
            followers.map((follower) => (
              <Link
                href={`/user/${follower.user.registrationNumber}`}
                key={follower.user.id}
                className="w-full flex gap-3 px-8"
              >
                <Image
                  src={follower.user.image}
                  alt={follower.user.name}
                  width={50}
                  height={50}
                  quality={100}
                  className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
                />
                <div className="flex flex-col justify-between">
                  <span>
                    <strong>{follower.user.name}</strong>
                  </span>
                  <span>{follower.user.course.name}</span>
                </div>
              </Link>
            ))
          ) : (
            <span>Esse usuário não segue ninguém ainda.</span>
          )}
        </div>
      </section>
    </main>
  );
}
