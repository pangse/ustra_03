"use client";

import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import NotificationSettings from "@/components/notifications/NotificationSettings";

interface Notification {
  id: string;
  userId: number;
  type: string;
  title: string;
  message: string;
  assetId?: number;
  read: boolean;
  notificationMethod: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  asset?: {
    name: string;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    type: "",
    method: "",
    read: "",
    search: "",
  });
  const [showSettings, setShowSettings] = useState(false);
  const ADMIN_USER_ID = 2; // 관리자 ID 고정

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filter.type) params.append("type", filter.type);
      if (filter.method) params.append("method", filter.method);
      if (filter.read) params.append("read", filter.read);
      if (filter.search) params.append("search", filter.search);
      params.append("userId", ADMIN_USER_ID.toString());

      const response = await fetch(`/api/notifications?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("알림을 불러오는 중 오류가 발생했습니다.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const getNotificationTypeBadge = (type: string) => {
    const types: { [key: string]: { color: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"; label: string } } = {
      RENTAL_EXPIRE: { color: "warning", label: "만료" },
      RENTAL_OVERDUE: { color: "error", label: "미반납" },
      SETTINGS_CHANGE: { color: "info", label: "설정" },
    };
    return types[type] || { color: "default", label: type };
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageBreadcrumb pageTitle="알림 관리" />
        <Button
          variant="outline"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? "알림 목록 보기" : "알림 설정"}
        </Button>
      </div>

      {showSettings ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <NotificationSettings userId={ADMIN_USER_ID} />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Select
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
            >
              <option value="">전체</option>
              <option value="RENTAL_EXPIRE">대여 만료</option>
              <option value="RENTAL_OVERDUE">미반납</option>
              <option value="SETTINGS_CHANGE">설정 변경</option>
            </Select>

            <Select
              name="method"
              value={filter.method}
              onChange={handleFilterChange}
            >
              <option value="">전체</option>
              <option value="SMS">문자</option>
              <option value="EMAIL">이메일</option>
              <option value="PUSH">푸시</option>
            </Select>

            <Select
              name="read"
              value={filter.read}
              onChange={handleFilterChange}
            >
              <option value="">전체</option>
              <option value="true">읽음</option>
              <option value="false">안읽음</option>
            </Select>

            <Input
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="검색어 입력"
            />
          </div>

          {/* Notifications Table */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            {loading ? (
              <div className="text-center py-4">로딩 중...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4">알림이 없습니다.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>알림 유형</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>수신자</TableHead>
                    <TableHead>전송 방식</TableHead>
                    <TableHead>읽음 상태</TableHead>
                    <TableHead>전송 일시</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => {
                    const typeInfo = getNotificationTypeBadge(notification.type);
                    return (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <Badge color={typeInfo.color}>{typeInfo.label}</Badge>
                        </TableCell>
                        <TableCell>{notification.title}</TableCell>
                        <TableCell>{notification.user.name}</TableCell>
                        <TableCell>{notification.notificationMethod}</TableCell>
                        <TableCell>
                          <Badge color={notification.read ? "success" : "warning"}>
                            {notification.read ? "읽음" : "안읽음"}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(notification.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  );
} 