"use client";
import { api } from "@/app/api";
import { user_car_type } from "@/app/api/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CarItem({ car }: { car: user_car_type }) {
  const router = useRouter();
  const deleteCar = async () => {
    const token = Cookies.get("user_token");
    try {
      const request = await api.delete(`/car/${car.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (request.status === 200) {
        toast.success("Carro excluído com sucesso!");
        router.refresh();
      } else {
        toast.error(`Falha ao excluir o veículo: ${request.statusText}`);
      }
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao excluir o veículo. Tente novamente mais tarde!"
      );
    }
  };
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"secondary"} className="w-[30px] h-[30px] p-0">
              <Trash2 className="text-destructive" size={18} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Este carro será excluído
                permanentemente do banco de dados e não poderá mais ser
                utilizado em novas viagens!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteCar()}
                className="bg-destructive text-white"
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
