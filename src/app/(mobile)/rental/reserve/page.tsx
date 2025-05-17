'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Material {
  id: number;
  name: string;
  rfid_tag: string;
  quantity: number;
  category: {
    name: string;
  };
  handler: {
    name: string;
    department: string;
    phone: string;
  };
  location: {
    name: string;
  };
}

export default function RentalReservePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get('type') || '';
  const id = searchParams?.get('id') || '';

  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await fetch(`/api/materials?rfid_tag=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch material details');
        }
        const data = await response.json();
        if (data.materials && data.materials.length > 0) {
          setMaterial(data.materials[0]);
        } else {
          setError('자재를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('자재 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching material:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMaterial();
    }
  }, [id]);

  const handleRental = () => {
    if (material) {
      router.push(`/rental/request?type=${type}&id=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <p className="text-gray-500">자재 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-white p-4">
        <p className="text-red-500">{error || '자재를 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">대여 요청 &gt; 대여 예약</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="font-medium">자산 상태</div>
              <div>양호</div>
              
              <div className="font-medium">자산 유형</div>
              <div>{material.category.name}</div>
              
              <div className="font-medium">보유 개수</div>
              <div>{material.quantity}개</div>
              
              <div className="font-medium">요청자</div>
              <div>{material.handler.name}</div>
              
              <div className="font-medium">부서</div>
              <div>{material.handler.department}</div>
              
              <div className="font-medium">연락처</div>
              <div>{material.handler.phone}</div>
              
              <div className="font-medium">보관 위치</div>
              <div>{material.location.name}</div>
            </div>
          </div>

          <button
            onClick={handleRental}
            className="w-full bg-black text-white py-3 rounded-lg font-medium"
          >
            대여
          </button>
        </div>
      </div>
    </div>
  );
} 