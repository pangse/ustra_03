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

// Mock asset/location/handler info
const mockAssetInfo: Record<string, { id: string; type: string; desc: string }> = {
  "무대 테이블": { id: "A-001", type: "무대장비", desc: "행사용 무대 테이블" },
  "LED 조명": { id: "L-002", type: "조명장비", desc: "고휘도 LED 조명" },
  "음향 믹서": { id: "S-003", type: "음향장비", desc: "12채널 믹서" },
  "마이크": { id: "M-004", type: "음향장비", desc: "무선 마이크" },
  "프로젝터": { id: "P-005", type: "영상장비", desc: "4K 프로젝터" },
  "스피커": { id: "S-006", type: "음향장비", desc: "PA 스피커" },
  "조명 스탠드": { id: "L-007", type: "조명장비", desc: "조명용 스탠드" },
  "카메라": { id: "C-008", type: "촬영장비", desc: "DSLR 카메라" },
  "노트북": { id: "N-009", type: "IT장비", desc: "업무용 노트북" },
  "태블릿": { id: "T-010", type: "IT장비", desc: "현장용 태블릿" },
};
const mockLocationInfo: Record<string, { address: string; manager: string; phone: string }> = {
  "서울 본사": { address: "서울시 강남구 테헤란로 123", manager: "김서울", phone: "02-123-4567" },
  "부산 지사": { address: "부산시 해운대구 센텀로 456", manager: "이부산", phone: "051-234-5678" },
  "도쿄 지사": { address: "일본 도쿄도 신주쿠구 1-2-3", manager: "사토", phone: "+81-3-1234-5678" },
  "뉴욕 지사": { address: "123 5th Ave, New York, NY", manager: "John Kim", phone: "+1-212-555-1234" },
  "파리 지사": { address: "10 Rue de Paris, Paris", manager: "Pierre", phone: "+33-1-23-45-67-89" },
};
const mockHandlers: Record<string, { phone: string; email: string; department: string }> = {
  "홍지은": { phone: "010-1111-2222", email: "hong@hybe.com", department: "물류팀" },
  "김현수": { phone: "010-2222-3333", email: "kim@hybe.com", department: "물류팀" },
  "박지수": { phone: "010-3333-4444", email: "park@hybe.com", department: "운영팀" },
  "이수민": { phone: "010-4444-5555", email: "lee@hybe.com", department: "운영팀" },
  "최민호": { phone: "010-5555-6666", email: "choi@hybe.com", department: "기술팀" },
};

export default function AssetMovementTable() {
  const [movements, setMovements] = useState<AssetMovement[]>([]);
  const [search, setSearch] = useState({ assetName: '', fromLocation: '', toLocation: '' });
  const [filtered, setFiltered] = useState<AssetMovement[]>(mockMovements);
  const [selectedAsset, setSelectedAsset] = useState<string|null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string|null>(null);
  const [selectedHandler, setSelectedHandler] = useState<string|null>(null);

  useEffect(() => {
    setMovements(mockMovements);
    setFiltered(mockMovements);
  }, []);

  const handleSearch = () => {
    setFiltered(
      movements.filter(m =>
        (!search.assetName || m.assetName.includes(search.assetName)) &&
        (!search.fromLocation || m.fromLocation === search.fromLocation) &&
        (!search.toLocation || m.toLocation === search.toLocation)
      )
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold">자산 이동 이력</h2>
      </div>
      {/* 검색 영역 */}
      <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        <div className="grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">자산명</label>
          <input className="col-span-2 border rounded px-2 py-1" value={search.assetName} onChange={e => setSearch(s => ({ ...s, assetName: e.target.value }))} placeholder="자산명 입력" />
          <label className="col-span-1 text-sm">이동 전 위치</label>
          <select className="col-span-2 border rounded px-2 py-1" value={search.fromLocation} onChange={e => setSearch(s => ({ ...s, fromLocation: e.target.value }))}>
            <option value="">전체</option>
            {[...new Set(mockMovements.map(m => m.fromLocation))].map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <label className="col-span-1 text-sm">이동 후 위치</label>
          <select className="col-span-2 border rounded px-2 py-1" value={search.toLocation} onChange={e => setSearch(s => ({ ...s, toLocation: e.target.value }))}>
            <option value="">전체</option>
            {[...new Set(mockMovements.map(m => m.toLocation))].map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="bg-black text-white px-3 py-1 rounded">조회</button>
        </div>
      </form>
      {/* 데스크탑: 테이블 */}
      <div className="hidden md:block">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">자산명</th>
              <th className="border px-4 py-2 text-center">이동 전 위치</th>
              <th className="border px-4 py-2 text-center">이동 후 위치</th>
              <th className="border px-4 py-2 text-center">담당자</th>
              <th className="border px-4 py-2 text-center">이동일</th>
              <th className="border px-4 py-2 text-center">메모</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td className="border px-4 py-2 text-center text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedAsset(m.assetName)}>{m.assetName}</td>
                <td className="border px-4 py-2 text-center text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedLocation(m.fromLocation)}>{m.fromLocation}</td>
                <td className="border px-4 py-2 text-center text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedLocation(m.toLocation)}>{m.toLocation}</td>
                <td className="border px-4 py-2 text-center text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedHandler(m.handler)}>{m.handler}</td>
                <td className="border px-4 py-2 text-center">{m.date}</td>
                <td className="border px-4 py-2 text-center">{m.memo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 레이어 팝업: 자산 상세 */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90vw] shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedAsset(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-4">자산 상세 정보</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">자산명:</span> {selectedAsset}</div>
              <div><span className="font-semibold">자산 ID:</span> {mockAssetInfo[selectedAsset]?.id || '-'}</div>
              <div><span className="font-semibold">분류:</span> {mockAssetInfo[selectedAsset]?.type || '-'}</div>
              <div><span className="font-semibold">설명:</span> {mockAssetInfo[selectedAsset]?.desc || '-'}</div>
            </div>
          </div>
        </div>
      )}
      {/* 레이어 팝업: 위치 상세 */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90vw] shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedLocation(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-4">위치 상세 정보</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">위치명:</span> {selectedLocation}</div>
              <div><span className="font-semibold">주소:</span> {mockLocationInfo[selectedLocation]?.address || '-'}</div>
              <div><span className="font-semibold">담당자:</span> {mockLocationInfo[selectedLocation]?.manager || '-'}</div>
              <div><span className="font-semibold">연락처:</span> {mockLocationInfo[selectedLocation]?.phone || '-'}</div>
            </div>
          </div>
        </div>
      )}
      {/* 레이어 팝업: 담당자 상세 */}
      {selectedHandler && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90vw] shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedHandler(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-4">담당자 정보</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">이름:</span> {selectedHandler}</div>
              <div><span className="font-semibold">연락처:</span> {mockHandlers[selectedHandler]?.phone || '-'}</div>
              <div><span className="font-semibold">이메일:</span> {mockHandlers[selectedHandler]?.email || '-'}</div>
              <div><span className="font-semibold">부서:</span> {mockHandlers[selectedHandler]?.department || '-'}</div>
            </div>
          </div>
        </div>
      )}
      {/* 모바일: 카드 */}
      <div className="block md:hidden space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">데이터가 없습니다</div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="font-semibold text-base mb-2 text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedAsset(m.assetName)}>{m.assetName}</div>
              <div className="text-xs text-gray-500 mb-1">
                이동 전 위치: <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedLocation(m.fromLocation)}>{m.fromLocation}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                이동 후 위치: <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedLocation(m.toLocation)}>{m.toLocation}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                담당자: <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedHandler(m.handler)}>{m.handler}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">이동일: <span className="text-gray-800">{m.date}</span></div>
              <div className="text-xs text-gray-500 mb-1">메모: <span className="text-gray-800">{m.memo || '-'}</span></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 