'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Material {
  id: number;
  name: string;
  rfid_tag: string;
  category: {
    name: string;
  };
}

export default function RentalSelectPage() {
  const router = useRouter();
  const [assetType, setAssetType] = useState('노트북');
  const [assetId, setAssetId] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/materials');
        if (!response.ok) {
          throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        setMaterials(data.materials);
      } catch (err) {
        setError('자재 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleSearch = () => {
    if (!assetId) {
      alert('자산 ID를 입력해주세요.');
      return;
    }
    router.push(`/rental/reserve?type=${assetType}&id=${assetId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">대여 요청 &gt; 자산 선택</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">자산 유형</label>
            <select 
              className="w-full p-3 border rounded-lg bg-white"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option value="노트북">노트북</option>
              <option value="의상">의상</option>
              <option value="소품">소품</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">자산 ID</label>
            <select
              className="w-full p-3 border rounded-lg bg-white"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
            >
              <option value="">자산을 선택하세요</option>
              {materials
                .filter(material => material.category.name === assetType)
                .map(material => (
                  <option key={material.id} value={material.rfid_tag}>
                    {material.name} ({material.rfid_tag})
                  </option>
                ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {loading && <p className="text-gray-500 text-sm">자재 목록을 불러오는 중...</p>}

          <button
            onClick={handleSearch}
            className="w-full bg-black text-white py-3 rounded-lg font-medium"
            disabled={loading}
          >
            조회
          </button>
        </div>
      </div>
    </div>
  );
} 