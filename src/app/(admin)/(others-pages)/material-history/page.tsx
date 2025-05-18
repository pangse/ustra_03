"use client";
import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import HistoryForm from "./HistoryForm";
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import MaterialHistoryPage from './MaterialHistoryPage';
import { MaterialHistory } from '@prisma/client';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Material {
  id: number;
  name: string;
  category?: { id: number; name: string };
  brand?: string;
  model?: string;
  serial?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface MaterialHistoryWithDetails {
  id: number;
  materialId: number;
  handlerId: number;
  type: string;
  quantity: number;
  date: string;
  memo: string;
  material: {
    name: string;
    rfid_tag: string;
  };
  handler: {
    name: string;
  };
}

export default function Page() {
  const [histories, setHistories] = useState<MaterialHistoryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      const response = await fetch('/api/material-history');
      if (!response.ok) {
        throw new Error('자산 이력을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setHistories(data.histories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">로딩 중...</div>;
  if (error) return <div className="text-center py-8 text-red-600">에러: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">자산 이력 관리</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">자산명</th>
              <th className="border px-4 py-2">RFID 태그</th>
              <th className="border px-4 py-2">유형</th>
              <th className="border px-4 py-2">수량</th>
              <th className="border px-4 py-2">처리자</th>
              <th className="border px-4 py-2">처리일시</th>
              <th className="border px-4 py-2">메모</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((history) => (
              <tr key={history.id}>
                <td className="border px-4 py-2">{history.material.name}</td>
                <td className="border px-4 py-2">{history.material.rfid_tag}</td>
                <td className="border px-4 py-2">{history.type}</td>
                <td className="border px-4 py-2">{history.quantity}</td>
                <td className="border px-4 py-2">{history.handler.name}</td>
                <td className="border px-4 py-2">{format(new Date(history.date), 'yyyy-MM-dd HH:mm', { locale: ko })}</td>
                <td className="border px-4 py-2">{history.memo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 