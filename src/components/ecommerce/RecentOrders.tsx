"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";

interface MaterialHistory {
  id: number;
  material: { name: string } | null;
  type: string;
  quantity: number;
  date: string;
  handler: { name: string } | null;
  memo?: string;
}

export default function RecentOrders() {
  const [histories, setHistories] = useState<MaterialHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            최근 입출고 이력
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">자산명</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">유형</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">수량</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">담당자</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">날짜</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">메모</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <td colSpan={6} className="text-center py-8">로딩 중...</td>
              </TableRow>
            ) : error ? (
              <TableRow>
                <td colSpan={6} className="text-center py-8">{error}</td>
              </TableRow>
            ) : histories.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="text-center py-8">데이터가 없습니다</td>
              </TableRow>
            ) : (
              histories.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="py-3">{h.material?.name || '-'}</TableCell>
                  <TableCell className="py-3">{h.type === 'IN' ? '입고' : '출고'}</TableCell>
                  <TableCell className="py-3">{h.quantity}</TableCell>
                  <TableCell className="py-3">{h.handler?.name || '-'}</TableCell>
                  <TableCell className="py-3">{new Date(h.date).toLocaleDateString()}</TableCell>
                  <TableCell className="py-3">{h.memo || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
