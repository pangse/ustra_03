"use client";
import { useEffect, useState } from "react";
import RentalRequestModal, { RentalRequestForm } from "@/components/RentalRequestModal";
import { useRouter } from "next/navigation";

interface Asset {
  id: number;
  group: string;
  type: string;
  assetId: string;
  name: string;
  warehouse: string;
  status: string;
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
  { id: 1, group: "의상", type: "무대의상", assetId: "C1000_10125", name: "루시 화이트 셋업", warehouse: "서울 본사", status: "정상" },
  { id: 2, group: "소품", type: "마이크", assetId: "P2000_20111", name: "무선 마이크 A", warehouse: "부산 지사", status: "대여중" },
  { id: 3, group: "IT장비", type: "노트북", assetId: "IT3000_30123", name: "맥북프로 16", warehouse: "서울 본사", status: "수선중" },
  { id: 4, group: "음향", type: "스피커", assetId: "A4000_40101", name: "JBL 스피커", warehouse: "도쿄 지사", status: "정상" },
  { id: 5, group: "조명", type: "LED 조명", assetId: "L5000_50111", name: "LED 무대조명", warehouse: "부산 지사", status: "폐기완료" },
];

const mockRepairLaundry: RepairLaundry[] = [
  { id: 1, assetId: 'C1000_10125', name: '루시 화이트 셋업', type: '무대의상', requestDate: '2024-06-01', processType: '수선', status: '진행중', handler: '김관리', location: '서울 본사', memo: '단추 교체' },
  { id: 2, assetId: 'P2000_20111', name: '무선 마이크 A', type: '마이크', requestDate: '2024-06-02', processType: '세탁', status: '완료', handler: '이세탁', location: '부산 지사', memo: '외관 세척' },
  { id: 3, assetId: 'IT3000_30123', name: '맥북프로 16', type: '노트북', requestDate: '2024-06-03', processType: '수선', status: '대기', handler: '박수리', location: '서울 본사', memo: '키보드 수리' },
];

const mockHandlers: HandlerInfo[] = [
  { name: '김관리', phone: '010-1234-5678', email: 'kim@hybe.com', department: '자산관리팀' },
  { name: '이세탁', phone: '010-2345-6789', email: 'lee@hybe.com', department: '세탁팀' },
  { name: '박수리', phone: '010-3456-7890', email: 'park@hybe.com', department: '수리팀' },
];

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

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">자산 관리 2</h2>
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
        <button className="px-4 py-2 border rounded text-sm bg-blue-600 text-white" onClick={() => setModal("excel-upload")}>엑셀업로드</button>
        <button className="px-4 py-2 border rounded text-sm bg-green-500 hover:bg-green-600 text-white" onClick={() => setModal("register")}>자산 등록</button>
        <button className="px-4 py-2 border rounded text-sm bg-yellow-400 hover:bg-yellow-500" onClick={() => setRentalModalOpen(true)}>대여 요청</button>
      </div>
      {/* 엑셀 양식 다운로드 모달 */}
      {modal === "excel-download" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-4">엑셀 양식 다운로드</h2>
            <div className="mb-4 text-gray-700">자산 등록/업로드용 샘플 엑셀 파일을 다운로드할 수 있습니다.</div>
            <a href="#" download className="inline-block px-4 py-2 bg-blue-600 text-white rounded mb-4">샘플 엑셀 다운로드</a>
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
                <button type="button" className="border p-2 rounded bg-blue-600 text-white text-sm">업로드</button>
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
                <button type="submit" className="border p-2 rounded bg-blue-600 text-white text-sm">저장</button>
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
      />
      {/* 자산 상세 레이어 팝업 (대여/수선 공통) */}
      {(selectedAsset || selectedRepair) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw] shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => { setSelectedAsset(null); setSelectedRepair(null); }}>&times;</button>
            <h2 className="text-lg font-bold mb-4">자산 상세 정보</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">자산명:</span> {selectedAsset?.name || selectedRepair?.name}</div>
              <div><span className="font-semibold">자산 그룹:</span> {selectedAsset?.group || '-'}</div>
              <div><span className="font-semibold">자산 분류:</span> {selectedAsset?.type || selectedRepair?.type}</div>
              <div><span className="font-semibold">자산 ID:</span> {selectedAsset?.assetId || selectedRepair?.assetId}</div>
              <div><span className="font-semibold">자산 창고:</span> {selectedAsset?.warehouse || selectedRepair?.location}</div>
              <div><span className="font-semibold">상태:</span> {selectedAsset?.status || selectedRepair?.status}</div>
            </div>
            {selectedRepair && (
              <>
                <div className="border-t my-4"></div>
                <h3 className="text-base font-semibold mb-2">수선·세탁 처리 정보</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold">처리유형:</span> {selectedRepair.processType}</div>
                  <div><span className="font-semibold">요청일:</span> {selectedRepair.requestDate}</div>
                  <div><span className="font-semibold">상태:</span> {selectedRepair.status}</div>
                  <div><span className="font-semibold">담당자:</span> {selectedRepair.handler}</div>
                  <div><span className="font-semibold">위치:</span> {selectedRepair.location}</div>
                  <div><span className="font-semibold">메모:</span> {selectedRepair.memo || '-'}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
      {/* 데스크탑: 테이블 */}
      {activeTab === 'rental' && (
        <div className="hidden md:block">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 w-8">
                  <input type="checkbox"
                    checked={filtered.length > 0 && checkedRental.length === filtered.length}
                    onChange={e => {
                      if (e.target.checked) setCheckedRental(filtered.map(a => a.id));
                      else setCheckedRental([]);
                    }}
                  />
                </th>
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
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    조회된 데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="border px-4 py-2 text-center">
                      <input type="checkbox"
                        checked={checkedRental.includes(a.id)}
                        onChange={e => {
                          if (e.target.checked) setCheckedRental(prev => [...prev, a.id]);
                          else setCheckedRental(prev => prev.filter(id => id !== a.id));
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{a.group}</td>
                    <td className="border px-4 py-2">{a.type}</td>
                    <td className="border px-4 py-2">{a.assetId}</td>
                    <td className="border px-4 py-2 text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedAsset(a)}>{a.name}</td>
                    <td className="border px-4 py-2">{a.warehouse}</td>
                    <td className="border px-4 py-2">{a.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'repair' && (
        <div className="hidden md:block">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 w-8">
                  <input type="checkbox"
                    checked={filteredRepair.length > 0 && checkedRepair.length === filteredRepair.length}
                    onChange={e => {
                      if (e.target.checked) setCheckedRepair(filteredRepair.map(r => r.id));
                      else setCheckedRepair([]);
                    }}
                  />
                </th>
                <th className="border px-4 py-2">NO</th>
                <th className="border px-4 py-2">자산 ID</th>
                <th className="border px-4 py-2">자산명</th>
                <th className="border px-4 py-2">분류</th>
                <th className="border px-4 py-2">처리유형</th>
                <th className="border px-4 py-2">요청일</th>
                <th className="border px-4 py-2">상태</th>
                <th className="border px-4 py-2">담당자</th>
                <th className="border px-4 py-2">위치</th>
                <th className="border px-4 py-2">메모</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepair.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-gray-400">
                    조회된 데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filteredRepair.map((r, idx) => (
                  <tr key={r.id}>
                    <td className="border px-4 py-2 text-center">
                      <input type="checkbox"
                        checked={checkedRepair.includes(r.id)}
                        onChange={e => {
                          if (e.target.checked) setCheckedRepair(prev => [...prev, r.id]);
                          else setCheckedRepair(prev => prev.filter(id => id !== r.id));
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{idx + 1}</td>
                    <td className="border px-4 py-2">{r.assetId}</td>
                    <td className="border px-4 py-2 text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedRepair(r)}>{r.name}</td>
                    <td className="border px-4 py-2">{r.type}</td>
                    <td className="border px-4 py-2">{r.processType}</td>
                    <td className="border px-4 py-2">{r.requestDate}</td>
                    <td className="border px-4 py-2">{r.status}</td>
                    <td className="border px-4 py-2 text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedHandler(mockHandlers.find(h => h.name === r.handler) || null)}>{r.handler}</td>
                    <td className="border px-4 py-2">{r.location}</td>
                    <td className="border px-4 py-2">{r.memo || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
            filtered.map((a) => (
              <div key={a.id} className="bg-white rounded shadow p-4">
                <div className="font-bold text-base mb-1 text-blue-600 hover:underline cursor-pointer" onClick={() => setSelectedAsset(a)}>{a.name}</div>
                <div className="text-xs text-gray-500 mb-1">자산 그룹: <span className="text-gray-800">{a.group}</span></div>
                <div className="text-xs text-gray-500 mb-1">자산 분류: <span className="text-gray-800">{a.type}</span></div>
                <div className="text-xs text-gray-500 mb-1">자산 ID: <span className="text-gray-800">{a.assetId}</span></div>
                <div className="text-xs text-gray-500 mb-1">자산 창고: <span className="text-gray-800">{a.warehouse}</span></div>
                <div className="text-xs text-gray-500 mb-1">상태: <span className="text-gray-800">{a.status}</span></div>
              </div>
            ))
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
              <div key={r.id} className="bg-white rounded shadow p-4">
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
            ))
          )}
        </div>
      )}
    </div>
  );
} 