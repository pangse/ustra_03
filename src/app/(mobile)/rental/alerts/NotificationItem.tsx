import React from "react";
import clsx from "clsx";

type Notification = {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  timeAgo: string;
  read: boolean;
  onClick?: () => void;
};

export default function NotificationItem({
  title,
  assetId,
  assetName,
  timeAgo,
  read,
  onClick,
}: Notification) {
  return (
    <div
      className={clsx(
        "relative rounded-lg p-4 mb-3 shadow border transition cursor-pointer",
        read
          ? "bg-gray-100 opacity-70"
          : "bg-white font-bold border-blue-200"
      )}
      onClick={onClick}
    >
      {/* 우측 상단 시간 */}
      <span className="absolute right-4 top-4 text-xs text-gray-400">{timeAgo}</span>
      {/* 제목 */}
      <div className={clsx("text-md", !read && "font-bold")}>{title}</div>
      {/* 내용 */}
      <div className="mt-1 text-xs text-gray-700">
        <div>자산 ID: {assetId}</div>
        <div>자산 이름: {assetName}</div>
      </div>
    </div>
  );
} 