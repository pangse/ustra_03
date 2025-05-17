'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RentalRequest {
  id: number;
  startDate: string;
  endDate: string;
  purpose: string;
  status: string;
  arrivalDate: string;
  material: {
    id: number;
    name: string;
    category: {
      name: string;
    };
    location: {
      name: string;
    };
  };
}

export default function MyRentalRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/rental-requests/my');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch rental requests');
      }

      const data = await response.json();
      console.log('Received rental requests:', data.requests);
      
      if (!data.requests || data.requests.length === 0) {
        setError('대여 내역이 없습니다.');
        return;
      }

      // Validate the data structure
      const validRequests = data.requests.filter((request: any) => {
        const isValid = request.material && 
                       request.material.category && 
                       request.material.location;
        if (!isValid) {
          console.error('Invalid request data:', request);
        }
        return isValid;
      });

      if (validRequests.length === 0) {
        setError('유효한 대여 내역이 없습니다.');
        return;
      }

      setRequests(validRequests);
    } catch (err) {
      console.error('Error fetching rental requests:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('대여 내역을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 페이지가 포커스를 받을 때마다 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      fetchRequests();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '대여중';
      case 'COMPLETED':
        return '완료';
      case 'PENDING':
        return '대기중';
      case 'REJECTED':
        return '거절됨';
      default:
        return status;
    }
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleReturn = () => {
    const selectedRequests = requests.filter(request => 
      selectedItems.has(request.id) && request.status === 'APPROVED'
    );

    if (selectedRequests.length === 0) {
      setError('반납 가능한 항목을 선택해주세요.');
      return;
    }

    // 선택된 항목들을 반납 페이지로 전달
    const returnItems = selectedRequests.map(request => {
      if (!request.material || !request.material.category || !request.material.location) {
        console.error('Invalid material data:', request);
        setError('자재 정보가 올바르지 않습니다.');
        return null;
      }

      return {
        id: request.id,
        materialId: request.material.id,
        materialName: request.material.name,
        categoryName: request.material.category.name,
        rentalLocation: request.material.location.name,
        returnLocation: request.material.location.name, // 기본값으로 대여 위치 설정
        returnDate: new Date().toISOString().slice(0, 16), // 현재 일시
        status: 'NORMAL' as const,
        statusDescription: ''
      };
    }).filter(Boolean);

    if (returnItems.length === 0) {
      setError('반납할 수 있는 항목이 없습니다.');
      return;
    }

    // 반납 페이지로 이동하면서 데이터 전달
    router.push('/rental/return?items=' + encodeURIComponent(JSON.stringify(returnItems)));
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-500">대여 내역을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">나의 대여 내역</h1>

        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">대여 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(request.id)}
                    onChange={() => toggleItemSelection(request.id)}
                    disabled={request.status !== 'APPROVED'}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{request.material.name}</h3>
                        <p className="text-sm text-gray-500">{request.material.category.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">사용 기간</span>
                        <span>
                          {new Date(request.startDate).toLocaleDateString('ko-KR')} ~{' '}
                          {new Date(request.endDate).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">희망 도착일</span>
                        <span>{new Date(request.arrivalDate).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">사용 목적</span>
                        <span className="text-right">{request.purpose}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleReturn}
            disabled={requests.filter(r => selectedItems.has(r.id) && r.status === 'APPROVED').length === 0}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            반납 선택 {selectedItems.size > 0 ? `(${selectedItems.size}건)` : ''}
          </button>
        </div>
      </div>
    </div>
  );
} 