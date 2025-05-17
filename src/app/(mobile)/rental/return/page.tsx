'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ReturnItem {
  id: number;
  materialId: number;
  materialName: string;
  categoryName: string;
  rentalLocation: string;
  returnLocation: string;
  returnDate: string;
  status: 'NORMAL' | 'DAMAGED' | 'LOST';
  statusDescription: string;
}

export default function ReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const itemsParam = searchParams?.get('items');
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam));
        setItems(parsedItems);
      } catch (err) {
        console.error('Error parsing items:', err);
        setError('반납할 항목을 불러오는데 실패했습니다.');
      }
    } else {
      setError('반납할 항목이 없습니다.');
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process return');
      }

      // 반납 처리 성공 시 성공 모달 표시
      setSuccess(true);
    } catch (err) {
      console.error('Error processing return:', err);
      setError(err instanceof Error ? err.message : '반납 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = (index: number, status: 'NORMAL' | 'DAMAGED' | 'LOST', description: string = '') => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, status, statusDescription: description } : item
    ));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={() => router.push('/rental/my-requests')}
            className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            대여 내역으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-center">반납할 항목이 없습니다.</p>
          <button
            onClick={() => router.push('/rental/my-requests')}
            className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            대여 내역으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">반납 처리</h1>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{item.materialName}</h3>
                <p className="text-sm text-gray-500">{item.categoryName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">대여 위치</span>
                  <span>{item.rentalLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">반납 위치</span>
                  <span>{item.returnLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">반납 일시</span>
                  <span>{new Date(item.returnDate).toLocaleString('ko-KR')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">상태</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateItemStatus(index, 'NORMAL')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                      item.status === 'NORMAL'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    정상
                  </button>
                  <button
                    onClick={() => updateItemStatus(index, 'DAMAGED')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                      item.status === 'DAMAGED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    파손
                  </button>
                  <button
                    onClick={() => updateItemStatus(index, 'LOST')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                      item.status === 'LOST'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    분실
                  </button>
                </div>
              </div>

              {item.status !== 'NORMAL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상태 설명
                  </label>
                  <input
                    type="text"
                    value={item.statusDescription}
                    onChange={(e) => updateItemStatus(index, item.status, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="상태에 대한 설명을 입력하세요"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : '반납 처리하기'}
          </button>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold">반납이 성공적으로 신청되었습니다.</p>
            <button
              onClick={() => router.push('/rental/return-history')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 