import { trip_type } from "@/app/api/types";
import { Clock, DollarSign, Map, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Post({ post }: { post: trip_type }) {
  return (
    <div>
      <Link
        href={`/user/${post.driver.id}`}
        className="flex items-center justify-start gap-3"
      >
        <Image
          src={post.driver.image}
          alt={post.driver.name}
          height={50}
          width={50}
          quality={100}
          className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
        />
        <div className="flex flex-col justify-between">
          <strong>
            <span>{post.driver.name}</span>
          </strong>
          <span>{post.driver.course.name}</span>
        </div>
      </Link>
      <Link href={`/trip/${post.id}`}>
        <div></div>
        <div className="grid w-full grid-cols-2">
          <span>
            <MapPin className="text-primary" size={18} />
            {post.AddressFrom.name.split(", ")[1]}
          </span>
          <span>
            <Map className="text-primary" size={18} />
            {post.AddressTo.name.split(", ")[1]}
          </span>
          <span>
            <Clock className="text-primary" size={18} />
            {post.when}
          </span>
          <span>
            <DollarSign className="text-primary" size={18} />
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(post.price)}
          </span>
        </div>
      </Link>
    </div>
  );
}
