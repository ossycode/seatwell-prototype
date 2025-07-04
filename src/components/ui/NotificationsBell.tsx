import { useGetNotificationsQuery } from "@/services/notificationsApi";
import { BellIcon } from "lucide-react";
import React from "react";

const NotificationsBell = ({ userId }: { userId?: string }) => {
  const { data: notes } = useGetNotificationsQuery(userId, { skip: !userId });
  const unread = notes?.filter((n) => !n.is_read)?.length ?? 0;

  return (
    <div className="relative">
      <BellIcon />
      {unread > 0 && (
        <span className="absolute top-0 right-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-xs">
          {unread}
        </span>
      )}
      {/* clicking could open a dropdown listing `notes` */}
    </div>
  );
};

export default NotificationsBell;
