"use client";
import { useEffect, useState } from "react";
import RentalRequestModal, { RentalRequestForm } from "@/components/RentalRequestModal";
import { useRouter } from "next/navigation";
import RepairRequestModal from "@/components/RepairRequestModal";
import dayjs from "dayjs";

interface Asset {
  id: number;
  rentalId?: string;
  group: string;
  type: string;
  assetId: string;
  name: string;
  warehouse: string;
  status: string;
  project?: string;
  requester?: string;
  arrivalDate?: string;
  destination?: string;
  rentalPeriod?: string;
  stockQuantity?: number;
  requestedQuantity?: number;
}

interface RepairLaundry {
  id: number;
  assetId: string;
  name: string;
  type: string;
  requestDate: string;
  processType: string; // '수선' or '세탁'
  status: string;
  handler: string;
  location: string;
  memo?: string;
}

interface HandlerInfo {
  name: string;
  phone: string;
  email: string;
  department: string;
}

const GROUPS = ["의상", "소품", "IT장비", "음향", "조명"];
const TYPES = ["무대의상", "마이크", "노트북", "스피커", "LED 조명"];
const WAREHOUSES = ["서울 본사", "부산 지사", "도쿄 지사"];
const STATUS = ["정상", "대여중", "수선중", "폐기완료"];

const mockAssetsInit: Asset[] = [
  { id: 1, rentalId: "R20240601-001", group: "의상", type: "무대의상", assetId: "C1000_10125", name: "루시 화이트 셋업", warehouse: "서울 본사", status: "정상", project: "광명 청소년 콘서트", requester: "이지수", arrivalDate: "2025-04-20", destination: "광명 아트홀", rentalPeriod: "2025.06.19~2025.06.22", stockQuantity: 10, requestedQuantity: 2 },
  { id: 2, rentalId: "R20240601-002", group: "소품", type: "마이크", assetId: "P2000_20111", name: "무선 마이크 A", warehouse: "부산 지사", status: "대여중", project: "부산 뮤직 페스티벌", requester: "김철수", arrivalDate: "2025-07-01", destination: "부산 아트센터", rentalPeriod: "2025.06.30~2025.07.04", stockQuantity: 5, requestedQuantity: 1 },
  { id: 3, rentalId: "R20240601-003", group: "IT장비", type: "노트북", assetId: "IT3000_30123", name: "맥북프로 16", warehouse: "서울 본사", status: "수선중", project: "서울 IT 컨퍼런스", requester: "박영희", arrivalDate: "2025-04-10", destination: "서울 코엑스", rentalPeriod: "2025.08.10~2025.08.14", stockQuantity: 3, requestedQuantity: 1 },
  { id: 4, rentalId: "R20240601-004", group: "음향", type: "스피커", assetId: "A4000_40101", name: "JBL 스피커", warehouse: "도쿄 지사", status: "정상", project: "도쿄 재즈 나잇", requester: "이유진", arrivalDate: "2025-09-05", destination: "도쿄홀", rentalPeriod: "2025.09.05~2025.09.09", stockQuantity: 8, requestedQuantity: 4 },
  { id: 5, rentalId: "R20240601-005", group: "조명", type: "LED 조명", assetId: "L5000_50111", name: "LED 무대조명", warehouse: "부산 지사", status: "폐기완료", project: "부산 뮤직 페스티벌", requester: "최민수", arrivalDate: "2025-10-01", destination: "부산 체육관", rentalPeriod: "2025.10.01~2025.10.05", stockQuantity: 20, requestedQuantity: 10 },
  { id: 6, rentalId: "R20240601-006", group: "의상", type: "무대의상", assetId: "C1000_10126", name: "블랙 퍼포먼스 슈트", warehouse: "서울 본사", status: "정상", project: "광명 청소년 콘서트", requester: "이지수", arrivalDate: "2025-05-10", destination: "광명 아트홀", rentalPeriod: "2025.06.19~2025.06.22", stockQuantity: 7, requestedQuantity: 1 },
  { id: 7, rentalId: "R20240601-007", group: "소품", type: "마이크", assetId: "P2000_20112", name: "유선 마이크 B", warehouse: "도쿄 지사", status: "대여중", project: "도쿄 재즈 나잇", requester: "이유진", arrivalDate: "2025-09-05", destination: "도쿄홀", rentalPeriod: "2025.09.05~2025.09.09", stockQuantity: 6, requestedQuantity: 2 },
  { id: 8, rentalId: "R20240601-008", group: "IT장비", type: "노트북", assetId: "IT3000_30124", name: "삼성 갤럭시북", warehouse: "부산 지사", status: "정상", project: "부산 뮤직 페스티벌", requester: "김철수", arrivalDate: "2025-07-01", destination: "부산 아트센터", rentalPeriod: "2025.06.30~2025.07.04", stockQuantity: 4, requestedQuantity: 1 },
  { id: 9, rentalId: "R20240601-009", group: "음향", type: "스피커", assetId: "A4000_40102", name: "BOSE 스피커", warehouse: "서울 본사", status: "수선중", project: "서울 IT 컨퍼런스", requester: "박영희", arrivalDate: "2025-08-10", destination: "서울 코엑스", rentalPeriod: "2025.08.10~2025.08.14", stockQuantity: 2, requestedQuantity: 1 },
  { id: 10, rentalId: "R20240601-010", group: "조명", type: "LED 조명", assetId: "L5000_50112", name: "무빙라이트", warehouse: "도쿄 지사", status: "정상", project: "도쿄 재즈 나잇", requester: "이유진", arrivalDate: "2025-09-05", destination: "도쿄홀", rentalPeriod: "2025.09.05~2025.09.09", stockQuantity: 9, requestedQuantity: 3 },
  { id: 11, rentalId: "R20240301-001", group: "의상", type: "무대의상", assetId: "C1000_10127", name: "레드 퍼포먼스 드레스", warehouse: "서울 본사", status: "대여중", project: "서울 봄 축제", requester: "김지원", arrivalDate: "2024-03-15", destination: "서울 올림픽공원", rentalPeriod: "2024.03.15~2024.03.20", stockQuantity: 5, requestedQuantity: 1 },
  { id: 12, rentalId: "R20240301-002", group: "음향", type: "스피커", assetId: "A4000_40103", name: "소형 스피커 세트", warehouse: "부산 지사", status: "대여중", project: "부산 해변 축제", requester: "박해수", arrivalDate: "2024-03-10", destination: "부산 해운대", rentalPeriod: "2024.03.10~2024.03.15", stockQuantity: 3, requestedQuantity: 2 },
  { id: 13, rentalId: "R20240301-003", group: "IT장비", type: "노트북", assetId: "IT3000_30125", name: "LG 그램", warehouse: "서울 본사", status: "대여중", project: "서울 스타트업 데모데이", requester: "이창업", arrivalDate: "2024-03-05", destination: "서울 강남", rentalPeriod: "2024.03.05~2024.03.10", stockQuantity: 2, requestedQuantity: 1 }
];

const mockRepairLaundry: RepairLaundry[] = [
  { id: 1, assetId: 'C1000_10125', name: '루시 화이트 셋업', type: '무대의상', requestDate: '2025-05-01', processType: '수선', status: '진행중', handler: '김관리', location: '서울 본사', memo: '단추 교체' },
  { id: 2, assetId: 'P2000_20111', name: '무선 마이크 A', type: '마이크', requestDate: '2025-05-02', processType: '세탁', status: '완료', handler: '이세탁', location: '부산 지사', memo: '외관 세척' },
  { id: 3, assetId: 'IT3000_30123', name: '맥북프로 16', type: '노트북', requestDate: '2025-05-03', processType: '수선', status: '대기', handler: '박수리', location: '서울 본사', memo: '키보드 수리' },
  { id: 4, assetId: 'C1000_10126', name: '블랙 퍼포먼스 슈트', type: '무대의상', requestDate: '2025-05-04', processType: '세탁', status: '진행중', handler: '이세탁', location: '서울 본사', memo: '얼룩 제거' },
  { id: 5, assetId: 'A4000_40102', name: 'BOSE 스피커', type: '스피커', requestDate: '2025-05-05', processType: '수선', status: '대기', handler: '박수리', location: '서울 본사', memo: '배선 교체' },
  { id: 6, assetId: 'L5000_50111', name: 'LED 무대조명', type: 'LED 조명', requestDate: '2025-05-06', processType: '수선', status: '완료', handler: '김관리', location: '부산 지사', memo: 'LED 모듈 교체' }
];

const mockHandlers: HandlerInfo[] = [
  { name: '김관리', phone: '010-1234-5678', email: 'kim@hybe.com', department: '자산관리팀' },
  { name: '이세탁', phone: '010-2345-6789', email: 'lee@hybe.com', department: '세탁팀' },
  { name: '박수리', phone: '010-3456-7890', email: 'park@hybe.com', department: '수리팀' },
  { name: '정담당', phone: '010-4567-8901', email: 'jung@hybe.com', department: '자산관리팀' },
  { name: '최기사', phone: '010-5678-9012', email: 'choi@hybe.com', department: '수리팀' }
];

// Helper to get remaining days
function getRemainingDays(rentalPeriod?: string) {
  if (!rentalPeriod) return null;
  const parts = rentalPeriod.split("~");
  if (parts.length !== 2) return null;
  const end = parts[1].trim().replace(/\./g, "-");
  const today = dayjs().startOf("day");
  const endDate = dayjs(end);
  if (!endDate.isValid()) return null;
  const diff = endDate.diff(today, "day");
  if (diff >= 0) return { text: `+${diff}`, overdue: false };
  else return { text: `${diff}`, overdue: true };
}

export default function AssetManagementMockPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssetsInit);
  const [search, setSearch] = useState({ group: "", type: "", assetId: "", name: "", warehouse: "", status: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ group: GROUPS[0], type: TYPES[0], assetId: "", name: "", warehouse: WAREHOUSES[0], status: STATUS[0] });
  const [modal, setModal] = useState<null | "excel-download" | "excel-upload" | "register" | "rent">(null);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<RepairLaundry | null>(null);
  const [selectedHandler, setSelectedHandler] = useState<HandlerInfo | null>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rental' | 'repair'>('rental');
  const [repairSearch, setRepairSearch] = useState({ processType: '', handler: '', assetId: '', name: '', location: '' });
  const [checkedRental, setCheckedRental] = useState<number[]>([]);
  const [checkedRepair, setCheckedRepair] = useState<number[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [selectedRepairs, setSelectedRepairs] = useState<RepairLaundry[]>([]);
  const [selectedCompletedRepair, setSelectedCompletedRepair] = useState<RepairLaundry | null>(null);
  const [returnedQuantity, setReturnedQuantity] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [returnConfirmData, setReturnConfirmData] = useState<{
    requestedQuantity: number;
    returnedQuantity: number;
  } | null>(null);

  useEffect(() => {
    if (selectedAsset) {
      setEditForm({
        rentalId: selectedAsset.rentalId || '',
        assetId: selectedAsset.assetId || '',
        requester: selectedAsset.requester || '',
        arrivalDate: selectedAsset.arrivalDate || '',
        project: selectedAsset.project || '',
        rentalPeriod: selectedAsset.rentalPeriod || '',
        name: selectedAsset.name || '',
        type: selectedAsset.type || '',
        requestedQuantity: selectedAsset.requestedQuantity || 0,
        returnedQuantity: returnedQuantity ?? 0,
        warehouse: selectedAsset.warehouse || '',
      });
      setReturnedQuantity(0);
    } else {
      setEditForm(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);

  // 검색 필터링
  const filtered = assets.filter(a =>
    (!search.group || a.group === search.group) &&
    (!search.type || a.type === search.type) &&
    (!search.assetId || a.assetId.includes(search.assetId)) &&
    (!search.name || a.name.includes(search.name)) &&
    (!search.warehouse || a.warehouse === search.warehouse) &&
    (!search.status || a.status === search.status)
  );

  // 수선/세탁 필터링
  const filteredRepair = mockRepairLaundry.filter(r =>
    (!repairSearch.processType || r.processType === repairSearch.processType) &&
    (!repairSearch.handler || r.handler === repairSearch.handler) &&
    (!repairSearch.assetId || r.assetId.includes(repairSearch.assetId)) &&
    (!repairSearch.name || r.name.includes(repairSearch.name)) &&
    (!repairSearch.location || r.location === repairSearch.location)
  );

  // 등록 핸들러
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAssets(prev => [
      ...prev,
      { ...form, id: prev.length ? Math.max(...prev.map(a => a.id)) + 1 : 1 }
    ]);
    setShowModal(false);
    setForm({ group: GROUPS[0], type: TYPES[0], assetId: "", name: "", warehouse: WAREHOUSES[0], status: STATUS[0] });
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    
    const remaining = editForm.requestedQuantity - editForm.returnedQuantity;
    if (remaining > 0) {
      setReturnConfirmData({
        requestedQuantity: editForm.requestedQuantity,
        returnedQuantity: editForm.returnedQuantity
      });
      setShowReturnConfirm(true);
    } else {
      // 전체 반납인 경우 바로 처리
      handleReturnConfirm();
    }
  };

  const handleReturnConfirm = () => {
    // 여기에 실제 반납 처리 로직 추가
    alert("반납 처리 완료");
    setShowReturnConfirm(false);
    setReturnConfirmData(null);
    setSelectedAsset(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">자산 관리</h2>
      {/* Tabs */}
      <div className="flex mb-4 space-x-2">
        <button
          className={`px-4 py-2 rounded-t font-semibold border ${activeTab === 'rental' ? 'bg-white text-black border-b-0' : 'bg-gray-200 text-gray-700 border-transparent'}`}
          onClick={() => setActiveTab('rental')}
        >
          대여 내역 <span className="text-yellow-500">★</span>
        </button>
        <button
          className={`px-4 py-2 rounded-t font-semibold border ${activeTab === 'repair' ? 'bg-white text-black border-b-0' : 'bg-gray-200 text-gray-700 border-transparent'}`}
          onClick={() => setActiveTab('repair')}
        >
          수선·세탁 처리
        </button>
      </div>
      {/* Search Box */}
      <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => e.preventDefault()}>
        <div className="grid grid-cols-6 gap-4 items-center">
          {/* 기존 자산 검색 필드 (대여 내역용) */}
          {activeTab === 'rental' && <>
            <label className="col-span-1 text-sm">자산 그룹 <span className="text-red-500">*</span></label>
            <select className="col-span-2 border rounded px-2 py-1" value={search.group} onChange={e => setSearch(s => ({ ...s, group: e.target.value }))}>
              <option value="">전체</option>
              {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <label className="col-span-1 text-sm">자산 분류</label>
            <select className="col-span-2 border rounded px-2 py-1" value={search.type} onChange={e => setSearch(s => ({ ...s, type: e.target.value }))}>
              <option value="">전체</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <label className="col-span-1 text-sm">자산 ID</label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={search.assetId} onChange={e => setSearch(s => ({ ...s, assetId: e.target.value }))} />
            <label className="col-span-1 text-sm">자산명</label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={search.name} onChange={e => setSearch(s => ({ ...s, name: e.target.value }))} />
            <label className="col-span-1 text-sm">자산 창고</label>
            <select className="col-span-2 border rounded px-2 py-1" value={search.warehouse} onChange={e => setSearch(s => ({ ...s, warehouse: e.target.value }))}>
              <option value="">전체</option>
              {WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <label className="col-span-1 text-sm">상태</label>
            <select className="col-span-2 border rounded px-2 py-1" value={search.status} onChange={e => setSearch(s => ({ ...s, status: e.target.value }))}>
              <option value="">전체</option>
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </>}
          {/* 수선/세탁 검색 필드 */}
          {activeTab === 'repair' && <>
            <label className="col-span-1 text-sm">처리유형</label>
            <select className="col-span-2 border rounded px-2 py-1" value={repairSearch.processType} onChange={e => setRepairSearch(s => ({ ...s, processType: e.target.value }))}>
              <option value="">전체</option>
              <option value="수선">수선</option>
              <option value="세탁">세탁</option>
            </select>
            <label className="col-span-1 text-sm">담당자</label>
            <select className="col-span-2 border rounded px-2 py-1" value={repairSearch.handler} onChange={e => setRepairSearch(s => ({ ...s, handler: e.target.value }))}>
              <option value="">전체</option>
              {mockHandlers.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
            </select>
            <label className="col-span-1 text-sm">자산 ID</label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={repairSearch.assetId} onChange={e => setRepairSearch(s => ({ ...s, assetId: e.target.value }))} />
            <label className="col-span-1 text-sm">자산명</label>
            <input className="col-span-2 border rounded px-2 py-1" placeholder="입력하세요" value={repairSearch.name} onChange={e => setRepairSearch(s => ({ ...s, name: e.target.value }))} />
            <label className="col-span-1 text-sm">위치</label>
            <select className="col-span-2 border rounded px-2 py-1" value={repairSearch.location} onChange={e => setRepairSearch(s => ({ ...s, location: e.target.value }))}>
              <option value="">전체</option>
              {WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </>}
        </div>
        <div className="mt-4 flex justify-end">
          <button type="button" className="bg-black text-white px-3 py-1 rounded" onClick={e => e.preventDefault()}>검색</button>
        </div>
      </form>
      {/* Buttons */}
      <div className="flex justify-end items-center mb-2 space-x-2">
        <button className="px-4 py-2 border rounded text-sm bg-white" onClick={() => setModal("excel-download")}>엑셀 양식 다운로드</button>
        <button className="px-4 py-2 border rounded text-sm bg-white" onClick={() => setModal("excel-upload")}>엑셀업로드</button>
        <button className="px-4 py-2 border rounded text-sm bg-white" onClick={() => setModal("register")}>자산 등록</button>
        {activeTab === 'rental' && (
          <button className="px-4 py-2 border rounded text-sm bg-white" onClick={() => {
            const selected = assets.filter(a => checkedRental.includes(a.id));
            setSelectedAssets(selected);
            setRentalModalOpen(true);
          }}>
            대여 요청
          </button>
        )}
        {activeTab === 'repair' && (
          <button className="px-4 py-2 border rounded text-sm bg-white" onClick={() => {
            const selected = filteredRepair.filter(r => checkedRepair.includes(r.id));
            setSelectedRepairs(selected);
            setRepairModalOpen(true);
          }}>
            수선 요청
          </button>
        )}
      </div>
      {/* 엑셀 양식 다운로드 모달 */}
      {modal === "excel-download" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-4">엑셀 양식 다운로드</h2>
            <div className="mb-4 text-gray-700">자산 등록/업로드용 샘플 엑셀 파일을 다운로드할 수 있습니다.</div>
            <a href="#" download className="inline-block px-4 py-2 text-gray rounded mb-4">샘플 엑셀 다운로드</a>
            <div className="flex gap-2 mt-2">
              <button type="button" className="border p-2 rounded bg-white text-sm" onClick={() => setModal(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
      {/* 엑셀 업로드 모달 */}
      {modal === "excel-upload" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-4">엑셀 업로드</h2>
            <form className="space-y-3">
              <input type="file" accept=".xlsx,.xls,.csv" className="border rounded p-2 w-full" />
              <div className="text-xs text-gray-500">엑셀 파일을 선택 후 업로드하세요. (실제 업로드는 mock)</div>
              <div className="flex gap-2 mt-2">
                <button type="button" className="border p-2 rounded bg-white text-sm">업로드</button>
                <button type="button" className="border p-2 rounded bg-white text-sm" onClick={() => setModal(null)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 자산 등록 모달 */}
      {modal === "register" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-4">자산 등록</h2>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">자산 그룹</label>
                <select className="border rounded p-2 w-full" value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))}>
                  {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">자산 분류</label>
                <select className="border rounded p-2 w-full" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">자산 ID</label>
                <input className="border rounded p-2 w-full" value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm mb-1">자산명</label>
                <input className="border rounded p-2 w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm mb-1">자산 창고</label>
                <select className="border rounded p-2 w-full" value={form.warehouse} onChange={e => setForm(f => ({ ...f, warehouse: e.target.value }))}>
                  {WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">상태</label>
                <select className="border rounded p-2 w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="border p-2 rounded bg-white text-sm">저장</button>
                <button type="button" className="border p-2 rounded bg-white text-sm" onClick={() => setModal(null)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 대여 요청 모달 */}
      <RentalRequestModal
        open={rentalModalOpen}
        onClose={() => setRentalModalOpen(false)}
        onSubmit={(data: RentalRequestForm) => {
          alert("대여 요청 완료: " + JSON.stringify(data, null, 2));
        }}
        selectedAssets={selectedAssets}
      />
      {/* 수선 요청 모달 */}
      <RepairRequestModal
        open={repairModalOpen}
        onClose={() => setRepairModalOpen(false)}
        selectedRepairs={selectedRepairs}
      />
      {/* 담당자 상세 레이어 팝업 */}
      {selectedHandler && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw] shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedHandler(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-4">담당자 정보</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">이름:</span> {selectedHandler.name}</div>
              <div><span className="font-semibold">연락처:</span> {selectedHandler.phone}</div>
              <div><span className="font-semibold">이메일:</span> {selectedHandler.email}</div>
              <div><span className="font-semibold">부서:</span> {selectedHandler.department}</div>
            </div>
          </div>
        </div>
      )}
      {/* 완료 내역 상세 레이어 팝업 */}
      {selectedCompletedRepair && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw] shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedCompletedRepair(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-4">완료된 수선/세탁 내역</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">자산명:</span> {selectedCompletedRepair.name}</div>
              <div><span className="font-semibold">자산 ID:</span> {selectedCompletedRepair.assetId}</div>
              <div><span className="font-semibold">분류:</span> {selectedCompletedRepair.type}</div>
              <div><span className="font-semibold">처리유형:</span> {selectedCompletedRepair.processType}</div>
              <div><span className="font-semibold">요청일:</span> {selectedCompletedRepair.requestDate}</div>
              <div><span className="font-semibold">담당자:</span> {selectedCompletedRepair.handler}</div>
              <div><span className="font-semibold">위치:</span> {selectedCompletedRepair.location}</div>
              <div><span className="font-semibold">메모:</span> {selectedCompletedRepair.memo || '-'}</div>
            </div>
          </div>
        </div>
      )}
      {/* 데스크탑: 테이블 */}
      {activeTab === 'rental' && (
        <div className="hidden md:block">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-1 py-0.5 w-8"></th>
                <th className="border px-1 py-0.5 text-center">NO</th>
                <th className="border px-1 py-0.5 text-center">대여ID</th>
                <th className="border px-1 py-0.5 text-center">자산 ID</th>
                <th className="border px-1 py-0.5 text-center">자산 그룹</th>
                <th className="border px-1 py-0.5 text-center">자산명</th>
                <th className="border px-1 py-0.5 text-center">요청 수량</th>
                <th className="border px-1 py-0.5 text-center">요청인</th>
                <th className="border px-1 py-0.5 text-center">프로젝트</th>
                <th className="border px-1 py-0.5 text-center">대여지</th>
                <th className="border px-1 py-0.5 text-center">대여기간</th>
                <th className="border px-1 py-0.5 text-center">수령일</th>
                <th className="border px-1 py-0.5 text-center">잔여일수</th>
                <th className="border px-1 py-0.5 text-center">상태</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-8 text-gray-400">
                    조회된 데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((a, idx) => {
                  const remain = getRemainingDays(a.rentalPeriod);
                  return (
                  <tr key={a.id} className={selectedAsset && selectedAsset.id === a.id ? "bg-yellow-50" : "cursor-pointer hover:bg-gray-50"} onClick={() => setSelectedAsset(a)}>
                    <td className="border px-1 py-0.5 text-center" onClick={e => e.stopPropagation()}>
                      <input type="checkbox"
                        checked={checkedRental.includes(a.id)}
                        disabled={a.status === '폐기완료' || a.status === '수선중'}
                        onChange={e => {
                          if (e.target.checked) setCheckedRental(prev => [...prev, a.id]);
                          else setCheckedRental(prev => prev.filter(id => id !== a.id));
                        }}
                      />
                    </td>
                    <td className="border px-1 py-0.5 text-center">{idx + 1}</td>
                    <td className="border px-1 py-0.5 text-center">{a.rentalId}</td>
                    <td className="border px-1 py-0.5 text-center">{a.assetId}</td>
                    <td className="border px-1 py-0.5 text-center">{a.group}</td>
                    <td className="border px-1 py-0.5 text-center text-blue-600 hover:underline cursor-pointer" onClick={e => { e.stopPropagation(); setSelectedAsset(a); }}>{a.name}</td>
                    <td className="border px-1 py-0.5 text-center">{a.requestedQuantity}</td>
                    <td className="border px-1 py-0.5 text-center">{a.requester}</td>
                    <td className="border px-1 py-0.5 text-center">{a.project}</td>
                    <td className="border px-1 py-0.5 text-center">{a.destination}</td>
                    <td className="border px-1 py-0.5 text-center">{a.rentalPeriod}</td>
                    <td className="border px-1 py-0.5 text-center">{a.arrivalDate}</td>
                    <td className="border px-1 py-0.5 text-center">
                      {remain ? (
                        remain.overdue ? <span className="text-red-500 font-bold">{remain.text}</span> : remain.text
                      ) : '-'}
                    </td>
                    <td className="border px-1 py-0.5 text-center">{a.status}</td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* 대여 내역 수정 모달 */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 min-w-[300px] max-w-[45vw] max-h-[45vh] shadow-lg relative flex flex-col">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedAsset(null)}>&times;</button>
            <h2 className="text-base font-bold mb-3">대여 내역 수정</h2>
            {editForm && (
              <form className="space-y-2 text-xs overflow-y-auto pr-2" onSubmit={handleReturnSubmit}>
                <div>
                  <label className="block font-semibold mb-1">대여ID</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.rentalId} onChange={e => setEditForm((f:any) => ({...f, rentalId: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">자산 ID</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.assetId} onChange={e => setEditForm((f:any) => ({...f, assetId: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">요청인</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.requester} onChange={e => setEditForm((f:any) => ({...f, requester: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">도착일</label>
                  <input type="date" className="border rounded p-1.5 w-full" value={editForm.arrivalDate} onChange={e => setEditForm((f:any) => ({...f, arrivalDate: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">콘텐츠</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.project} onChange={e => setEditForm((f:any) => ({...f, project: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">대여 기간</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.rentalPeriod} onChange={e => setEditForm((f:any) => ({...f, rentalPeriod: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">자산 이름</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.name} onChange={e => setEditForm((f:any) => ({...f, name: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">자산 유형</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.type} onChange={e => setEditForm((f:any) => ({...f, type: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">요청 수량</label>
                  <input type="number" className="border rounded p-1.5 w-full" value={editForm.requestedQuantity} onChange={e => setEditForm((f:any) => ({...f, requestedQuantity: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">반납 수량</label>
                  <input type="number" className="border rounded p-1.5 w-full" value={editForm.returnedQuantity} onChange={e => setEditForm((f:any) => ({...f, returnedQuantity: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">재고 위치</label>
                  <input className="border rounded p-1.5 w-full" value={editForm.warehouse} onChange={e => setEditForm((f:any) => ({...f, warehouse: e.target.value}))} />
                </div>
                <div className="flex gap-2 mt-3 sticky bottom-0 bg-white pt-2">
                  <button type="submit" className="bg-white text-xs px-3 py-1.5 border rounded">반납신청</button>
                  <button type="button" className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 border rounded" onClick={() => setSelectedAsset(null)}>취소</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* 반납 확인 모달 */}
      {showReturnConfirm && returnConfirmData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw] shadow-lg">
            <h2 className="text-lg font-bold mb-4">반납신청완료</h2>
            <div className="space-y-2 text-sm mb-6">
              <div>대여 수량: {returnConfirmData.requestedQuantity}개</div>
              <div>현재 반납 수량: {returnConfirmData.returnedQuantity}개</div>
              <div>잔여 수량: {returnConfirmData.requestedQuantity - returnConfirmData.returnedQuantity}개</div>
              <div className="text-red-500">
                아직 반납되지 않은 {returnConfirmData.requestedQuantity - returnConfirmData.returnedQuantity}개가 있습니다.
              </div>
              <div className="mt-2">
                {returnConfirmData.returnedQuantity}개만 반납 처리하시겠습니까?
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleReturnConfirm}
                className="bg-white text-sm px-4 py-2 border rounded"
              >
                확인
              </button>
              <button
                onClick={() => {
                  setShowReturnConfirm(false);
                  setReturnConfirmData(null);
                }}
                className="bg-gray-200 text-gray-700 text-sm px-4 py-2 border rounded"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 모바일: 카드 */}
      {activeTab === 'rental' && (
        <div className="block md:hidden space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded shadow p-6 text-center text-gray-400">
              조회된 데이터가 없습니다
            </div>
          ) : (
            filtered.map((a, idx) => {
              const remain = getRemainingDays(a.rentalPeriod);
              return (
              <div key={a.id} className="bg-white rounded shadow p-4 flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checkedRental.includes(a.id)}
                  disabled={a.status === '폐기완료' || a.status === '수선중'}
                  onChange={e => {
                    if (e.target.checked) setCheckedRental(prev => [...prev, a.id]);
                    else setCheckedRental(prev => prev.filter(id => id !== a.id));
                  }}
                />
                <div className="flex-1">
                  <div className="font-bold text-base mb-1 text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedAsset(a)}>{a.name}</div>
                  <div className="text-xs text-gray-500 mb-1">대여ID: <span className="text-gray-800">{a.rentalId}</span></div>
                  <div className="text-xs text-gray-500 mb-1">자산 ID: <span className="text-gray-800">{a.assetId}</span></div>
                  <div className="text-xs text-gray-500 mb-1">요청인: <span className="text-gray-800">{a.requester}</span></div>
                  <div className="text-xs text-gray-500 mb-1">도착 희망일: <span className="text-gray-800">{a.arrivalDate}</span></div>
                  <div className="text-xs text-gray-500 mb-1">도착지: <span className="text-gray-800">{a.destination}</span></div>
                  <div className="text-xs text-gray-500 mb-1">콘텐츠: <span className="text-gray-800">{a.project}</span></div>
                  <div className="text-xs text-gray-500 mb-1">대여기간: <span className="text-gray-800">{a.rentalPeriod}</span></div>
                  <div className="text-xs text-gray-500 mb-1">잔여일수: <span className={remain && remain.overdue ? "text-red-500 font-bold" : "text-gray-800"}>{remain ? remain.text : '-'}</span></div>
                  <div className="text-xs text-gray-500 mb-1">자산 이름: <span className="text-gray-800">{a.name}</span></div>
                  <div className="text-xs text-gray-500 mb-1">자산 유형: <span className="text-gray-800">{a.type}</span></div>
                  <div className="text-xs text-gray-500 mb-1">재고 수량: <span className="text-gray-800">{a.stockQuantity}</span></div>
                  <div className="text-xs text-gray-500 mb-1">요청 수량: <span className="text-gray-800">{a.requestedQuantity}</span></div>
                  <div className="text-xs text-gray-500 mb-1">재고 위치: <span className="text-gray-800">{a.warehouse}</span></div>
                  <div className="text-xs text-gray-500 mb-1">상태: <span className="text-gray-800">{a.status}</span></div>
                </div>
              </div>
            )})
          )}
        </div>
      )}
      {activeTab === 'repair' && (
        <div className="block md:hidden space-y-4">
          {filteredRepair.length === 0 ? (
            <div className="bg-white rounded shadow p-6 text-center text-gray-400">
              조회된 데이터가 없습니다
            </div>
          ) : (
            filteredRepair.map((r, idx) => (
              <div key={r.id} className="bg-white rounded shadow p-4 flex items-center">
                {r.status !== '완료' && (
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={checkedRepair.includes(r.id)}
                    disabled={r.status === '폐기완료' || r.status === '수선중'}
                    onChange={e => {
                      if (e.target.checked) setCheckedRepair(prev => [...prev, r.id]);
                      else setCheckedRepair(prev => prev.filter(id => id !== r.id));
                    }}
                  />
                )}
                <div className="flex-1">
                  <div className="font-bold text-base mb-1 text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedRepair(r)}>{r.name}</div>
                  <div className="text-xs text-gray-500 mb-1">자산 ID: <span className="text-gray-800">{r.assetId}</span></div>
                  <div className="text-xs text-gray-500 mb-1">분류: <span className="text-gray-800">{r.type}</span></div>
                  <div className="text-xs text-gray-500 mb-1">처리유형: <span className="text-gray-800">{r.processType}</span></div>
                  <div className="text-xs text-gray-500 mb-1">요청일: <span className="text-gray-800">{r.requestDate}</span></div>
                  <div className="text-xs text-gray-500 mb-1">상태: <span className="text-gray-800">{r.status}</span></div>
                  <div className="text-xs text-gray-500 mb-1">담당자: <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedHandler(mockHandlers.find(h => h.name === r.handler) || null)}>{r.handler}</span></div>
                  <div className="text-xs text-gray-500 mb-1">위치: <span className="text-gray-800">{r.location}</span></div>
                  <div className="text-xs text-gray-500 mb-1">메모: <span className="text-gray-800">{r.memo || '-'}</span></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 