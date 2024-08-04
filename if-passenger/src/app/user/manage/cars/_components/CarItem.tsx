import { user_car_type } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CarItem({ car }: { car: user_car_type }) {
  return (
    <div className="w-full min-w-full flex items-center justify-between">
      <div className="flex flex-col">
        <strong className="inline-block max-w-[31ch] overflow-hidden text-ellipsis whitespace-nowrap">
          <span>{car.brand} </span>
          <span className="capitalize">{car.model}</span>
        </strong>
        <span>{car.licensePlate}</span>
      </div>
      <div className="flex gap-2">
        <Link href={`/user/manage/cars/${car.id}`}>
          <Button variant={"secondary"} className="w-[30px] h-[30px] p-0">
            <Pencil className="text-primary" size={18} />
          </Button>
        </Link>

        <Link href={`/user/manage/cars/${car.id}`}>
          <Button variant={"secondary"} className="w-[30px] h-[30px] p-0">
            <Trash2 className="text-destructive" size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
