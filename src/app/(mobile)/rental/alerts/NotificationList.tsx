import React from "react";
import NotificationItem from "./NotificationItem";

type Notification = {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  timeAgo: string;
  read: boolean;
};

type Props = {
  notifications: Notification[];
  onItemClick?: (id: string) => void;
};

export default function NotificationList({ notifications, onItemClick }: Props) {
  return (
    <div>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          {...n}
          onClick={() => onItemClick?.(n.id)}
        />
      ))}
    </div>
  );
} 