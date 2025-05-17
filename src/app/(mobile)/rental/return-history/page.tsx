'use client';

import { useEffect, useState } from 'react';

interface ReturnHistory {
  id: number;
  rentalRequestId: number;
  materialId: number;
  returnLocation: string;
  returnDate: string;
  status: string;
  statusDescription: string;
  material: {
    name: string;
    category: {
      name: string;
    };
  };
}

export default function ReturnHistoryPage() {
  const [returns, setReturns] = useState<ReturnHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await fetch('/api/returns');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch return history');
        }

        const data = await response.json();
        setReturns(data.data || []);
      } catch (err) {
        console.error('Error fetching return history:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('반납 내역을 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return '정상';
      case 'REPAIR':
        return '수선 필요';
      case 'DAMAGED':
        return '파손';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'bg-green-100 text-green-800';
      case 'REPAIR':
        return 'bg-yellow-100 text-yellow-800';
      case 'DAMAGED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-500">반납 내역을 불러오는 중...</p>
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">반납 내역</h1>

      {returns.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">반납 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((returnItem) => (
            <div
              key={returnItem.id}
              className="bg-white rounded-lg shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{returnItem.material.name}</h3>
                  <p className="text-sm text-gray-500">{returnItem.material.category.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(returnItem.status)}`}>
                  {getStatusText(returnItem.status)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">반납 위치</span>
                  <span>{returnItem.returnLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">반납 일시</span>
                  <span>{new Date(returnItem.returnDate).toLocaleString('ko-KR')}</span>
                </div>
                {returnItem.statusDescription && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">상태 설명</span>
                    <span className="text-right">{returnItem.statusDescription}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 