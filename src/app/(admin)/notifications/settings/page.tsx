"use client";

import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NotificationSettings from "@/components/notifications/NotificationSettings";

export default function NotificationSettingsPage() {
  const [userId, setUserId] = useState<number>(2); // 임시로 2로 설정, 실제로는 로그인한 사용자의 ID를 사용해야 함

  return (
    <div>
      <div className="mb-6">
        <PageBreadcrumb pageTitle="알림 설정" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <NotificationSettings userId={userId} />
      </div>
    </div>
  );
} 