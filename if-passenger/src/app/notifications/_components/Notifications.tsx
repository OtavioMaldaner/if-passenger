import { notification_type } from "@/app/api/types";
import NotificationItem from "./NotificationItem";

export default function Notifications({
  notifications,
}: {
  notifications: notification_type[];
}) {
  return (
    <section className="flex flex-col items-center justify-center max-w-[92%] mt-5 gap-5 w-full">
      {notifications.map((notification) => {
        return (
          <NotificationItem notification={notification} key={notification.id} />
        );
      })}
    </section>
  );
}
