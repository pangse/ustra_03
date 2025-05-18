"use client";
import { useState } from "react";

// Mock Data
const mockAssets = [
  {
    id: 1,
    group: "의상",
    type: "무대의상",
    assetId: "C1000_10125",
    name: "루시 화이트 셋업",
    warehouse: "서울 본사",
    status: "정상",
  },
  {
    id: 2,
    group: "소품",
    type: "마이크",
    assetId: "P2000_20111",
    name: "무선 마이크 A",
    warehouse: "부산 지사",
    status: "대여중",
  },
  {
    id: 3,
    group: "IT장비",
    type: "노트북",
    assetId: "IT3000_30123",
    name: "맥북프로 16",
    warehouse: "서울 본사",
    status: "수선중",
  },
  {
    id: 4,
    group: "음향",
    type: "스피커",
    assetId: "A4000_40101",
    name: "JBL 스피커",
    warehouse: "도쿄 지사",
    status: "정상",
  },
  {
    id: 5,
    group: "조명",
    type: "LED 조명",
    assetId: "L5000_50111",
    name: "LED 무대조명",
    warehouse: "부산 지사",
    status: "폐기완료",
  },
];

const statusColors: Record<string, string> = {
  "정상": "bg-green-100 text-green-800",
  "대여중": "bg-blue-100 text-blue-800",
  "수선중": "bg-yellow-100 text-yellow-800",
  "폐기완료": "bg-gray-200 text-gray-500",
};

export default function AssetManagementMockPage() {
  const [filters, setFilters] = useState({
    group: "",
    type: "",
    assetId: "",
    name: "",
    warehouse: "",
  });

  const filtered = mockAssets.filter((a) =>
    (!filters.group || a.group.includes(filters.group)) &&
    (!filters.type || a.type.includes(filters.type)) &&
    (!filters.assetId || a.assetId.includes(filters.assetId)) &&
    (!filters.name || a.name.includes(filters.name)) &&
    (!filters.warehouse || a.warehouse.includes(filters.warehouse))
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar mock (간단히) */}
      <aside className="w-64 bg-black text-white p-4 hidden md:block">
        <div className="text-2xl font-bold mb-6">HYBE</div>
        <div className="text-sm mb-2">⭐ 즐겨찾기</div>
        <nav className="space-y-1 text-sm">
          {["자산 조회", "자산 관리", "자산 대여", "자산 반납", "자산 이전", "자산 분실", "자산 폐기", "수선·세탁 처리"].map((item) => (
            <div key={item} className="py-1 hover:bg-gray-700 px-2 rounded cursor-pointer">{item}</div>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Tabs */}
        <div className="flex mb-4 space-x-2">
          <div className="bg-white border rounded-t px-4 py-2 text-black font-semibold">
            자산 관리 <span className="text-yellow-500">★</span>
          </div>
          <div className="bg-gray-200 rounded-t px-4 py-2 text-gray-700">수선·세탁 처리</div>
        </div>
        {/* Search Box */}
        <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-6 gap-4 items-center">
            <label className="col-span-1 text-sm">자산 그룹 <span className="text-red-500">*</span></label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={filters.group} onChange={e => setFilters(f => ({ ...f, group: e.target.value }))} />
            <label className="col-span-1 text-sm">자산 분류</label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} />
            <label className="col-span-1 text-sm">자산 ID</label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={filters.assetId} onChange={e => setFilters(f => ({ ...f, assetId: e.target.value }))} />
            <label className="col-span-1 text-sm">자산명</label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={filters.name} onChange={e => setFilters(f => ({ ...f, name: e.target.value }))} />
            <label className="col-span-1 text-sm">자산 창고</label>
            <input className="col-span-4 border rounded px-2 py-1" placeholder="입력하세요" value={filters.warehouse} onChange={e => setFilters(f => ({ ...f, warehouse: e.target.value }))} />
            <button className="col-span-1 bg-black text-white px-3 py-1 rounded">검색</button>
          </div>
        </form>
        {/* Buttons */}
        <div className="flex justify-end items-center mb-2 space-x-2">
          <button className="px-4 py-2 border rounded text-sm bg-white">엑셀 양식 다운로드</button>
          <button className="px-4 py-2 border rounded text-sm bg-blue-600 text-white">엑셀업로드</button>
          <button className="px-4 py-2 border rounded text-sm bg-yellow-400 hover:bg-yellow-500">자산 등록</button>
        </div>
        {/* Table (데스크탑) */}
        <div className="bg-white rounded shadow p-6 text-sm hidden md:block">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">자산 그룹</th>
                <th className="border px-4 py-2">자산 분류</th>
                <th className="border px-4 py-2">자산 ID</th>
                <th className="border px-4 py-2">자산명</th>
                <th className="border px-4 py-2">자산 창고</th>
                <th className="border px-4 py-2">상태</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">조회된 데이터가 없습니다</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id}>
                  <td className="border px-4 py-2">{a.group}</td>
                  <td className="border px-4 py-2">{a.type}</td>
                  <td className="border px-4 py-2">{a.assetId}</td>
                  <td className="border px-4 py-2">{a.name}</td>
                  <td className="border px-4 py-2">{a.warehouse}</td>
                  <td className={`border px-4 py-2`}>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[a.status] || "bg-gray-100 text-gray-500"}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 모바일 카드형 */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded shadow p-6 text-center text-gray-400">조회된 데이터가 없습니다</div>
          ) : filtered.map(a => (
            <div key={a.id} className="bg-white rounded shadow p-4">
              <div className="font-bold text-base mb-1">{a.name}</div>
              <div className="text-xs text-gray-500 mb-1">자산 그룹: <span className="text-gray-800">{a.group}</span></div>
              <div className="text-xs text-gray-500 mb-1">자산 분류: <span className="text-gray-800">{a.type}</span></div>
              <div className="text-xs text-gray-500 mb-1">자산 ID: <span className="text-gray-800">{a.assetId}</span></div>
              <div className="text-xs text-gray-500 mb-1">자산 창고: <span className="text-gray-800">{a.warehouse}</span></div>
              <div className="text-xs text-gray-500 mb-1">상태: <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[a.status] || "bg-gray-100 text-gray-500"}`}>{a.status}</span></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 