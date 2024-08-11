import { notification_content_types, notification_type } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotificationItem({
  notification,
}: {
  notification: notification_type;
}) {
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
          <Button className="flex-1 max-w-[146px] max-h-[30px]">Aceitar</Button>
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
