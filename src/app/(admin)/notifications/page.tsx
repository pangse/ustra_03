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

const EXAMPLE_DATA = [
  { id: 1, type: "SYSTEM", title: "대여 요청이 완료 되었습니다.", receiver: "김관리", method: "SYSTEM", read: false, createdAt: "2025-05-19 23:24" },
  { id: 2, type: "SYSTEM", title: "반납이 완료되었습니다.", receiver: "김관리", method: "SYSTEM", read: false, createdAt: "2025-05-19 23:25" },
  { id: 3, type: "SYSTEM", title: "대여 기한이 지났습니다.", receiver: "김관리", method: "SYSTEM", read: true, createdAt: "2025-05-19 23:24" },
  { id: 4, type: "SYSTEM", title: "대여 요청이 반려되었습니다.", receiver: "김관리", method: "SYSTEM", read: true, createdAt: "2025-05-19 23:25" },
  { id: 5, type: "SYSTEM", title: "새로운 공지사항이 있습니다.", receiver: "김관리", method: "SYSTEM", read: false, createdAt: "2025-05-19 23:25" },
  { id: 6, type: "SYSTEM", title: "대여 요청이 승인되었습니다.", receiver: "김관리", method: "EMAIL", read: false, createdAt: "2025-05-20 09:10" },
  { id: 7, type: "SYSTEM", title: "반납 요청이 접수되었습니다.", receiver: "김관리", method: "SMS", read: true, createdAt: "2025-05-20 10:15" },
  { id: 8, type: "SYSTEM", title: "대여 연장 요청이 도착했습니다.", receiver: "김관리", method: "SYSTEM", read: false, createdAt: "2025-05-20 11:20" },
  { id: 9, type: "SYSTEM", title: "대여 연장 요청이 반려되었습니다.", receiver: "김관리", method: "EMAIL", read: true, createdAt: "2025-05-20 12:30" },
  { id: 10, type: "SYSTEM", title: "대여 기한 임박 알림", receiver: "김관리", method: "SMS", read: false, createdAt: "2025-05-20 13:40" },
  { id: 11, type: "SYSTEM", title: "대여 요청이 취소되었습니다.", receiver: "김관리", method: "SYSTEM", read: true, createdAt: "2025-05-20 14:50" },
  { id: 12, type: "SYSTEM", title: "반납 지연 알림", receiver: "김관리", method: "EMAIL", read: false, createdAt: "2025-05-20 15:00" },
  { id: 13, type: "SYSTEM", title: "대여 요청이 접수되었습니다.", receiver: "김관리", method: "SMS", read: true, createdAt: "2025-05-20 16:10" },
  { id: 14, type: "SYSTEM", title: "공지사항: 시스템 점검 안내", receiver: "김관리", method: "SYSTEM", read: false, createdAt: "2025-05-20 17:20" },
  { id: 15, type: "SYSTEM", title: "대여 요청이 승인 대기 중입니다.", receiver: "김관리", method: "EMAIL", read: false, createdAt: "2025-05-20 18:30" },
];

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

  // 필터링 로직
  const filtered = EXAMPLE_DATA.filter((n) => {
    return (
      (!filter.type || n.type === filter.type) &&
      (!filter.method || n.method === filter.method) &&
      (!filter.read || (filter.read === "true" ? n.read : !n.read)) &&
      (!filter.search || n.title.includes(filter.search))
    );
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">알림 관리</h2>
      {/* Filters */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">알림 유형</label>
          <select className="col-span-2 border rounded px-2 py-1" name="type" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
            <option value="">전체</option>
            <option value="SYSTEM">시스템</option>
          </select>
          <label className="col-span-1 text-sm">전송 방식</label>
          <select className="col-span-2 border rounded px-2 py-1" name="method" value={filter.method} onChange={e => setFilter(f => ({ ...f, method: e.target.value }))}>
            <option value="">전체</option>
            <option value="SYSTEM">SYSTEM</option>
            <option value="EMAIL">이메일</option>
            <option value="SMS">문자</option>
          </select>
          <label className="col-span-1 text-sm">읽음 상태</label>
          <select className="col-span-2 border rounded px-2 py-1" name="read" value={filter.read} onChange={e => setFilter(f => ({ ...f, read: e.target.value }))}>
            <option value="">전체</option>
            <option value="false">안읽음</option>
            <option value="true">읽음</option>
          </select>
          <label className="col-span-1 text-sm">검색어</label>
          <input className="col-span-2 border rounded px-2 py-1" name="search" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} placeholder="검색어 입력" />
        </div>
        <div className="mt-4 flex justify-end">
          <button type="button" className="bg-black text-white px-3 py-1 rounded">조회</button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-center">알림 유형</th>
              <th className="border px-2 py-2 text-center">제목</th>
              <th className="border px-2 py-2 text-center">수신자</th>
              <th className="border px-2 py-2 text-center">전송 방식</th>
              <th className="border px-2 py-2 text-center">읽음 상태</th>
              <th className="border px-2 py-2 text-center">전송 일시</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((n) => (
              <tr key={n.id}>
                <td className="border px-2 py-2 text-center">{n.type}</td>
                <td className="border px-2 py-2 text-center">{n.title}</td>
                <td className="border px-2 py-2 text-center">{n.receiver}</td>
                <td className="border px-2 py-2 text-center">{n.method}</td>
                <td className="border px-2 py-2 text-center">
                  {n.read ? (
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">읽음</span>
                  ) : (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">안읽음</span>
                  )}
                </td>
                <td className="border px-2 py-2 text-center">{n.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 