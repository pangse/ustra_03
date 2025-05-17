'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReturnHistory {
  id: number;
  createdAt: string;
  returnLocation: string;
  status: string;
  statusDescription: string;
  rentalRequest: {
    material: {
      name: string;
      category: {
        name: string;
      };
      location: {
        name: string;
      };
    };
  };
}

export default function MyReturnsPage() {
  const router = useRouter();
  const [returns, setReturns] = useState<ReturnHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await fetch('/api/returns/my');
        if (!response.ok) {
          throw new Error('Failed to fetch return history');
        }
        const data = await response.json();
        setReturns(data.returns);
      } catch (err) {
        console.error('Error fetching return history:', err);
        setError('반납 내역을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">나의 반납 내역</h1>

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
                    <h3 className="font-semibold text-lg">
                      {returnItem.rentalRequest.material.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {returnItem.rentalRequest.material.category.name}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    반납완료
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">반납일</span>
                    <span>
                      {new Date(returnItem.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">반납 위치</span>
                    <span>{returnItem.returnLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">상태</span>
                    <span>{returnItem.statusDescription || '정상'}</span>
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
            onClick={() => router.push('/rental/my-requests')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            내 대여 이력으로 이동
          </button>
        </div>
      </div>
    </div>
  );
} 