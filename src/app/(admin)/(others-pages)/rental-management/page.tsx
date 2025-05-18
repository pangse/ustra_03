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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/rental-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('상태 변경에 실패했습니다.');

      setRentalRequests(prev =>
        prev.map(request =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      APPROVED: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800"
    };

    const statusLabels = {
      APPROVED: "대여중",
      COMPLETED: "반납완료"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const filteredRequests = rentalRequests.filter(request => {
    if (filters.status && request.status !== filters.status) return false;
    if (filters.materialId && request.material.id.toString() !== filters.materialId) return false;
    if (filters.userId && request.material.location?.name !== filters.userId) return false;
    return true;
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">자산 대여 관리</h1>
      </div>

      {/* 필터 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">상태 선택</option>
          <option value="APPROVED">대여중</option>
          <option value="COMPLETED">반납완료</option>
        </select>
      </div>

      {/* 대여 요청 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">자산</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대여 기간</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">목적</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">요청사항</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.material?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.material.location?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.startDate).toLocaleDateString()} ~ {new Date(request.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.purpose}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.arrivalDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {request.status === 'APPROVED' && (
                    <button
                      onClick={() => handleStatusChange(request.id.toString(), 'COMPLETED')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      반납 처리
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}
    </div>
  );
} 