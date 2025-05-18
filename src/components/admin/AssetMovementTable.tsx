"use client";
import { useEffect, useState } from "react";

interface AssetMovement {
  id: number;
  assetName: string;
  fromLocation: string;
  toLocation: string;
  handler: string;
  date: string;
  memo?: string;
}

const mockMovements: AssetMovement[] = [
  { id: 1, assetName: "무대 테이블", fromLocation: "서울 본사", toLocation: "부산 지사", handler: "홍지은", date: "2024-06-01", memo: "행사 이동" },
  { id: 2, assetName: "LED 조명", fromLocation: "부산 지사", toLocation: "서울 본사", handler: "김현수", date: "2024-06-03", memo: "정기 점검" },
  { id: 3, assetName: "음향 믹서", fromLocation: "서울 본사", toLocation: "도쿄 지사", handler: "박지수", date: "2024-06-05", memo: "해외 공연 지원" },
  { id: 4, assetName: "마이크", fromLocation: "도쿄 지사", toLocation: "서울 본사", handler: "이수민", date: "2024-06-07", memo: "장비 회수" },
  { id: 5, assetName: "프로젝터", fromLocation: "서울 본사", toLocation: "뉴욕 지사", handler: "최민호", date: "2024-06-09", memo: "국제 컨퍼런스" },
  { id: 6, assetName: "스피커", fromLocation: "뉴욕 지사", toLocation: "부산 지사", handler: "홍지은", date: "2024-06-11", memo: "장비 재배치" },
  { id: 7, assetName: "조명 스탠드", fromLocation: "부산 지사", toLocation: "파리 지사", handler: "김현수", date: "2024-06-13", memo: "해외 전시" },
  { id: 8, assetName: "카메라", fromLocation: "파리 지사", toLocation: "서울 본사", handler: "박지수", date: "2024-06-15", memo: "촬영 후 복귀" },
  { id: 9, assetName: "노트북", fromLocation: "서울 본사", toLocation: "부산 지사", handler: "이수민", date: "2024-06-17", memo: "업무 지원" },
  { id: 10, assetName: "태블릿", fromLocation: "부산 지사", toLocation: "도쿄 지사", handler: "최민호", date: "2024-06-19", memo: "현장 관리" },
  { id: 11, assetName: "프로젝터", fromLocation: "도쿄 지사", toLocation: "파리 지사", handler: "홍지은", date: "2024-06-21", memo: "유럽 행사" },
  { id: 12, assetName: "LED 조명", fromLocation: "파리 지사", toLocation: "뉴욕 지사", handler: "김현수", date: "2024-06-23", memo: "미국 전시" },
  { id: 13, assetName: "음향 믹서", fromLocation: "뉴욕 지사", toLocation: "서울 본사", handler: "박지수", date: "2024-06-25", memo: "장비 점검" },
  { id: 14, assetName: "마이크", fromLocation: "서울 본사", toLocation: "부산 지사", handler: "이수민", date: "2024-06-27", memo: "공연 준비" },
  { id: 15, assetName: "무대 테이블", fromLocation: "부산 지사", toLocation: "도쿄 지사", handler: "최민호", date: "2024-06-29", memo: "해외 임대" },
  { id: 16, assetName: "카메라", fromLocation: "도쿄 지사", toLocation: "뉴욕 지사", handler: "홍지은", date: "2024-07-01", memo: "글로벌 프로젝트" },
  { id: 17, assetName: "스피커", fromLocation: "뉴욕 지사", toLocation: "파리 지사", handler: "김현수", date: "2024-07-03", memo: "음향 지원" },
  { id: 18, assetName: "조명 스탠드", fromLocation: "파리 지사", toLocation: "서울 본사", handler: "박지수", date: "2024-07-05", memo: "장비 복귀" },
  { id: 19, assetName: "노트북", fromLocation: "서울 본사", toLocation: "뉴욕 지사", handler: "이수민", date: "2024-07-07", memo: "업무 출장" },
  { id: 20, assetName: "태블릿", fromLocation: "뉴욕 지사", toLocation: "부산 지사", handler: "최민호", date: "2024-07-09", memo: "현장 지원" },
];

export default function AssetMovementTable() {
  const [movements, setMovements] = useState<AssetMovement[]>([]);

  useEffect(() => {
    setMovements(mockMovements);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">자산 이동 이력</h2>
      {/* 데스크탑: 테이블 */}
      <div className="hidden md:block">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">자산명</th>
              <th className="border px-4 py-2">이동 전 위치</th>
              <th className="border px-4 py-2">이동 후 위치</th>
              <th className="border px-4 py-2">담당자</th>
              <th className="border px-4 py-2">이동일</th>
              <th className="border px-4 py-2">메모</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td className="border px-4 py-2">{m.assetName}</td>
                <td className="border px-4 py-2">{m.fromLocation}</td>
                <td className="border px-4 py-2">{m.toLocation}</td>
                <td className="border px-4 py-2">{m.handler}</td>
                <td className="border px-4 py-2">{m.date}</td>
                <td className="border px-4 py-2">{m.memo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 모바일: 카드 */}
      <div className="block md:hidden space-y-4">
        {movements.map((m) => (
          <div key={m.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
            <div className="font-semibold text-base mb-2">{m.assetName}</div>
            <div className="text-xs text-gray-500 mb-1">이동 전 위치: <span className="text-gray-800">{m.fromLocation}</span></div>
            <div className="text-xs text-gray-500 mb-1">이동 후 위치: <span className="text-gray-800">{m.toLocation}</span></div>
            <div className="text-xs text-gray-500 mb-1">이동일: <span className="text-gray-800">{m.date}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
} 