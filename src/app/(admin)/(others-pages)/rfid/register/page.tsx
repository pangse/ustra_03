'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RfidRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const rfidTag = formData.get('rfidTag') as string;
    const materialId = formData.get('materialId') as string;

    try {
      const response = await fetch('/api/rfid/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfidTag,
          materialId: Number(materialId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'RFID 태그 등록에 실패했습니다.');
      }

      setSuccess('RFID 태그가 성공적으로 등록되었습니다.');
      e.currentTarget.reset();
    } catch (err) {
      console.error('Error registering RFID tag:', err);
      setError(err instanceof Error ? err.message : 'RFID 태그 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">RFID 태그 등록</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rfidTag" className="block text-sm font-medium text-gray-700 mb-1">
              RFID 태그
            </label>
            <input
              type="text"
              id="rfidTag"
              name="rfidTag"
              required
              className="w-full p-2 border rounded-lg"
              placeholder="RFID 태그를 입력하세요"
            />
          </div>

          <div>
            <label htmlFor="materialId" className="block text-sm font-medium text-gray-700 mb-1">
              자산 ID
            </label>
            <input
              type="number"
              id="materialId"
              name="materialId"
              required
              className="w-full p-2 border rounded-lg"
              placeholder="자산 ID를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? '처리 중...' : 'RFID 태그 등록'}
          </button>
        </form>
      </div>
    </div>
  );
} 