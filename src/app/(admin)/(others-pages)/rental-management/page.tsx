"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

interface Material {
  id: number;
  name: string;
  category?: { name: string };
  location?: { name: string };
  brand?: string;
  model?: string;
  serial?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface RentalRequest {
  id: number;
  startDate: string;
  endDate: string;
  purpose: string;
  status: string;
  arrivalDate: string;
  material: Material;
  memo: string;
}

export default function RentalManagementPage() {
  const router = useRouter();
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    materialId: '',
    userId: ''
  });
  const [search, setSearch] = useState({ name: '', status: '' });

  // 초기 데이터 로드
  useEffect(() => {
    const fetchRentalRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rental-requests/my');
        if (!response.ok) {
          throw new Error('대여 요청 목록을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setRentalRequests(data.requests || []);
      } catch (err) {
        console.error('Error fetching rental requests:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalRequests();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (id: number, newStatus: string, request: RentalRequest) => {
    try {
      // 1. 상태 변경
      const response = await fetch(`/api/rental-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('상태 변경에 실패했습니다.');

      // 2. 이력 등록 (handlerId는 임시로 1)
      await fetch('/api/material-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: request.material.id,
          handlerId: 2, // TODO: 실제 로그인 사용자 id로 교체
          type: newStatus === 'COMPLETED' ? '입고' : '출고',
          quantity: 1,
          memo: '대여 반납 처리',
        }),
      });

      setRentalRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error('Error updating status or registering history:', err);
      alert('상태 변경 또는 이력 등록에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLabels = {
      APPROVED: "대여중",
      COMPLETED: "반납완료"
    };
    return (
      <span className="px-2 py-1 rounded text-xs border bg-gray-50">
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const filteredRequests = rentalRequests.filter(request => {
    if (search.status && request.status !== search.status) return false;
    if (search.name && !request.material.name.includes(search.name)) return false;
    return true;
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="border border-red-300 bg-red-50 text-red-700 p-2 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">자산 대여 관리</h1>

      {/* 검색 영역 */}
      <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => e.preventDefault()}>
        <div className="grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">자산명</label>
          <input className="col-span-2 border rounded px-2 py-1" value={search.name} onChange={e => setSearch(s => ({ ...s, name: e.target.value }))} placeholder="자산명 입력" />
          <label className="col-span-1 text-sm">상태</label>
          <select className="col-span-2 border rounded px-2 py-1" value={search.status} onChange={e => setSearch(s => ({ ...s, status: e.target.value }))}>
            <option value="">전체</option>
            <option value="APPROVED">대여중</option>
            <option value="COMPLETED">반납완료</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="bg-black text-white px-3 py-1 rounded">조회</button>
        </div>
      </form>

      {/* 데스크탑: 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">자산</th>
              <th className="border px-4 py-2">신청자</th>
              <th className="border px-4 py-2">대여 기간</th>
              <th className="border px-4 py-2">목적</th>
              <th className="border px-4 py-2">상태</th>
              <th className="border px-4 py-2 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td className="border px-4 py-2">{request.material?.name}</td>
                <td className="border px-4 py-2">{request.material.location?.name}</td>
                <td className="border px-4 py-2">{new Date(request.startDate).toLocaleDateString()} ~ {new Date(request.endDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{request.purpose}</td>
                <td className="border px-4 py-2">{getStatusBadge(request.status)}</td>
                <td className="border px-4 py-2 text-center">
                  {request.status === 'APPROVED' && (
                    <button
                      onClick={() => handleStatusChange(request.id, 'COMPLETED', request)}
                      className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600"
                      aria-label="Return"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9.75m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 모바일: 카드 */}
      <div className="block md:hidden space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
            <div className="font-semibold text-base mb-2">{request.material?.name}</div>
            <div className="text-xs text-gray-500 mb-1">신청자: <span className="text-gray-800">{request.material.location?.name}</span></div>
            <div className="text-xs text-gray-500 mb-1">대여 기간: <span className="text-gray-800">{new Date(request.startDate).toLocaleDateString()} ~ {new Date(request.endDate).toLocaleDateString()}</span></div>
            <div className="text-xs text-gray-500 mb-1">목적: <span className="text-gray-800">{request.purpose}</span></div>
            <div className="text-xs text-gray-500 mb-1">상태: <span className="text-gray-800">{getStatusBadge(request.status)}</span></div>
            {request.status === 'APPROVED' && (
              <button
                onClick={() => handleStatusChange(request.id, 'COMPLETED', request)}
                className="mt-2 w-full rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600 bg-white"
                aria-label="Return"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9.75m0 0l3-3m-3 3l3 3" />
                </svg>
                Return
              </button>
            )}
          </div>
        ))}
      </div>
      {/* 로딩 표시 */}
      {loading && (
        <div className="text-center py-4 text-gray-500">로딩 중...</div>
      )}
    </div>
  );
} 