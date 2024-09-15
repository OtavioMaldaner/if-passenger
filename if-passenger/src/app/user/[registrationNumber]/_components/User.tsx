"use client";

import { getDecodedToken } from "@/app/api/functions";
import { JWTToken, trip_type, user_type } from "@/app/api/types";
import Feed from "@/components/default/Feed";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Follow from "./Follow";

export default function User({
  user,
  trips,
}: {
  user: user_type;
  trips: trip_type[];
}) {
  const token = Cookies.get("user_token");
  const decoded_token: JWTToken = getDecodedToken();
  const router = useRouter();
  return (
    <main className="flex flex-col gap-7">
      <section className="w-full px-6 flex flex-col gap-7 mt-[110px]">
        <div className="flex items-center justify-start gap-3 w-full">
          <Image
            src={user.image}
            alt={user.name}
            height={50}
            width={50}
            quality={100}
            className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
          />
          <div className="flex flex-col justify-between">
            <strong>
              <span>{user.name}</span>
            </strong>
            <span>{user.course}</span>
          </div>
        </div>
        <div className="flex flex-col">
          {user.description.split("\n").map((paragraph, index) => {
            return <span key={index}>{paragraph}</span>;
          })}
        </div>
        <div className="flex justify-between">
          <Link href={`/user/${user.registrationNumber}/followers`}>
            {user.followers == 1 ? (
              <span>
                <strong>{user.followers}</strong> seguidor
              </span>
            ) : (
              <span>
                <strong>{user.followers}</strong> seguidores
              </span>
            )}
          </Link>
          <Link href={`/user/${user.registrationNumber}/following`}>
            <span>
              <strong>{user.following}</strong> seguindo
            </span>
          </Link>
        </div>
        <div className="flex justify-around">
          {user.id === decoded_token.sub ? (
            <Button
              variant="follow"
              size="user"
              onClick={() => {
                router.push(`/user/edit`);
              }}
            >
              Editar Perfil
            </Button>
          ) : (
            <Follow
              token={token ?? ""}
              userId={user.id}
              followedByUser={user.followedByUser}
            />
          )}
          <Button
            variant="follow"
            size="user"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                console.log("URL copied to clipboard");
              } catch (err) {
                console.log("Failed to copy URL: ", err);
              }
            }}
          >
            Compartilhar
          </Button>
        </div>

        <h1 className="text-xl text-center">Viagens Recentes</h1>
      </section>
      <Feed trips={trips} />
    </main>
  );
}
