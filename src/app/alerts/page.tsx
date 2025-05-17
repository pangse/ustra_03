"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  userId: number;
  type: string;
  title: string;
  message: string;
  assetId: number | null;
  assetName: string | null;
  createdAt: string;
  read: boolean;
  notificationMethod: string;
}

type FilterType = "all" | "unread" | "rental" | "system";

export default function AlertsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) {
          throw new Error("알림 데이터를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session, router]);

  const handleNotificationClick = async (id: string) => {
    try {
      // 알림 읽음 상태 업데이트
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      
      // 알림 상세 페이지로 이동
      router.push(`/alerts/${id}`);
    } catch (err) {
      console.error('알림 상태 업데이트 실패:', err);
    }
  };

  // 필터링된 알림 목록 계산
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "rental") return notification.type === "RENTAL_EXPIRE" || notification.type === "RENTAL_OVERDUE";
    if (filter === "system") return notification.type === "SETTINGS_CHANGE";
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">알림센터</h1>
            <button
              onClick={() => router.push("/alerts/settings")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              알림 설정
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {/* 알림 필터 */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                className={`px-3 py-1 text-sm font-medium rounded-full ${filter === "all" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setFilter("all")}
              >
                전체
              </button>
              <button
                className={`px-3 py-1 text-sm font-medium rounded-full ${filter === "unread" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setFilter("unread")}
              >
                미읽음
              </button>
              <button
                className={`px-3 py-1 text-sm font-medium rounded-full ${filter === "rental" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setFilter("rental")}
              >
                대여 관련
              </button>
              <button
                className={`px-3 py-1 text-sm font-medium rounded-full ${filter === "system" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setFilter("system")}
              >
                시스템
              </button>
            </div>
          </div>

          {/* 알림 리스트 */}
          <div className="divide-y divide-gray-200">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                알림이 없습니다.
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                            새 알림
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      {notification.assetName && (
                        <p className="mt-1 text-sm text-gray-500">
                          자산: {notification.assetName}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// 시간 포맷팅 헬퍼 함수
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "방금 전";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return `${Math.floor(diffInSeconds / 604800)}주 전`;
} 