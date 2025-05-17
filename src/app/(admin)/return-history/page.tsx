"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ReturnHistory {
  id: string;
  rentalRequestId: string;
  materialId: string;
  returnLocation: string;
  returnDate: string;
  status: "NORMAL" | "DAMAGED" | "LOST";
  statusDescription: string | null;
  createdAt: string;
  updatedAt: string;
  material: {
    name: string;
    category: string;
    assetType: string;
  };
  user: {
    name: string;
    email: string;
  };
}

export default function ReturnHistoryPage() {
  const router = useRouter();
  const [returns, setReturns] = useState<ReturnHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await fetch("/api/returns");
      if (!response.ok) {
        throw new Error("Failed to fetch return history");
      }
      const data = await response.json();
      setReturns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">반납 내역</h1>
        <p className="mt-1 text-sm text-gray-500">
          자재 반납 내역과 상태를 확인할 수 있습니다.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  반납자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  자재 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  반납 위치
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  반납일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비고
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.map((returnItem) => (
                <tr key={returnItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {returnItem.user.name}
                    </div>
                    <div className="text-sm text-gray-500">{returnItem.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{returnItem.material.name}</div>
                    <div className="text-sm text-gray-500">
                      {returnItem.material.category} / {returnItem.material.assetType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{returnItem.returnLocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(returnItem.returnDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        returnItem.status === "NORMAL"
                          ? "bg-green-100 text-green-800"
                          : returnItem.status === "DAMAGED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {returnItem.status === "NORMAL"
                        ? "정상"
                        : returnItem.status === "DAMAGED"
                        ? "파손"
                        : "분실"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {returnItem.statusDescription || "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 