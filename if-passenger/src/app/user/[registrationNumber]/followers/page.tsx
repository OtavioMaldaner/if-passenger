import { api } from "@/app/api";
import { follow_type } from "@/app/api/types";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Followers({
  params,
}: {
  params: { registrationNumber: string };
}) {
  const registrationNumber: string = params.registrationNumber;
  const token = cookies().get("user_token")?.value;

  const userRequest = await api.get(`/followers/${registrationNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const followers: follow_type[] = userRequest.data.followers;

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
      <section>
        <h1>Seguidores</h1>
        {followers.map((follower) => (
          <div key={follower.user.id}>
            <Image
              src={follower.user.image}
              alt={follower.user.name}
              width={50}
              height={50}
              quality={100}
            />
            <span>{follower.user.name}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
