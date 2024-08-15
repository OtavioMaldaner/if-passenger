"use client";
import { api } from "@/app/api";
import { notification_content_types, notification_type } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast } from "sonner";

export default function NotificationItem({
  notification,
}: {
  notification: notification_type;
}) {
  const acceptTripRequest = async () => {
    try {
      const request = await api.post(
        "/tripRequests/accept",
        {
          requestId: notification.tripReqId,
          notificationId: notification.id,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("user_token")}`,
          },
        }
      );

      if (request.status == 201) {
        toast("Requisição de carona aceita com sucesso!");
      }
    } catch (e) {
      toast(
        "Erro ao aceitar solicitação de carona. Tente novamente mais tarde!"
      );
    }
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex items-center">
        <div className="flex gap-3 items-center">
          <Image
            src={notification.image}
            alt={notification.userId}
            height={50}
            width={50}
            quality={100}
            className="rounded-full max-h-[50px] max-w-[50px] h-[50px]"
          />
          <span>
            <strong>{notification.content.split("%")[1]}</strong>{" "}
            <span>{notification.content.split("%")[2]}</span>
          </span>
        </div>
      </div>
      {notification.type == notification_content_types.TRIP_REQUEST && (
        <div className="flex items-center justify-around gap-2">
          <Button
            className="flex-1 max-w-[146px] max-h-[30px]"
            onClick={() => acceptTripRequest()}
          >
            Aceitar
          </Button>
          <Button
            variant="destructive"
            className="flex-1 max-w-[146px] max-h-[30px]"
          >
            Recusar
          </Button>
        </div>
      )}
    </div>
  );
}
