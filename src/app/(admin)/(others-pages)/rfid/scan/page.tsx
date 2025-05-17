'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RfidScanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setScanResult(null);

    try {
      const response = await fetch('/api/rfid/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'RFID 스캔에 실패했습니다.');
      }

      setScanResult(data);
      setSuccess('RFID 태그가 성공적으로 스캔되었습니다.');
    } catch (err) {
      console.error('Error scanning RFID tag:', err);
      setError(err instanceof Error ? err.message : 'RFID 스캔에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">RFID 스캔</h1>

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

        <div className="space-y-6">
          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? '스캔 중...' : 'RFID 스캔 시작'}
          </button>

          {scanResult && (
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">스캔 결과</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">RFID 태그:</span>
                  <span className="font-medium">{scanResult.rfidTag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">자산 ID:</span>
                  <span className="font-medium">{scanResult.materialId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">자산명:</span>
                  <span className="font-medium">{scanResult.materialName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">스캔 시간:</span>
                  <span className="font-medium">
                    {new Date(scanResult.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 