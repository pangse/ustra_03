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
  id: string;
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

interface MaterialHistoryWithDetails extends MaterialHistory {
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">자산 이력 관리</h1>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">자산명</th>
              <th className="px-4 py-2 border">RFID 태그</th>
              <th className="px-4 py-2 border">유형</th>
              <th className="px-4 py-2 border">수량</th>
              <th className="px-4 py-2 border">처리자</th>
              <th className="px-4 py-2 border">처리일시</th>
              <th className="px-4 py-2 border">메모</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((history) => (
              <tr key={history.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{history.material.name}</td>
                <td className="px-4 py-2 border">{history.material.rfid_tag}</td>
                <td className="px-4 py-2 border">{history.type}</td>
                <td className="px-4 py-2 border">{history.quantity}</td>
                <td className="px-4 py-2 border">{history.handler.name}</td>
                <td className="px-4 py-2 border">
                  {format(new Date(history.date), 'yyyy-MM-dd HH:mm', { locale: ko })}
                </td>
                <td className="px-4 py-2 border">{history.memo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 