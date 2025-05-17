import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchNotification = async () => {
      try {
        const response = await fetch(`/api/notifications/${params.id}`);
        if (!response.ok) {
          throw new Error("알림 데이터를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setNotification(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [session, router, params.id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!notification) return <div>알림을 찾을 수 없습니다.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{notification.title}</h1>
      <p className="mb-4">{notification.message}</p>
      <p className="text-sm text-gray-500">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
      {notification.assetName && (
        <p className="text-sm text-gray-500">자산: {notification.assetName}</p>
      )}
      <button
        onClick={() => router.back()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        뒤로 가기
      </button>
    </div>
  );
} 