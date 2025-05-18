"use client";
import { useEffect, useState } from "react";

interface AssetType {
  id: number;
  typeCode: string;
  name: string;
  description?: string;
  extension?: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}

export default function AssetTypesPage() {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [filter, setFilter] = useState({ typeCode: '', name: '', extension: '', isActive: '' });
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<AssetType | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAssetTypes = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.typeCode) params.append('q', filter.typeCode);
    if (filter.name) params.append('q', filter.name);
    if (filter.extension) params.append('q', filter.extension);
    if (filter.isActive) params.append('isActive', filter.isActive);
    const res = await fetch(`/api/asset-types?${params.toString()}`);
    const data = await res.json();
    setAssetTypes(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchAssetTypes(); }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSearch = () => { fetchAssetTypes(); };
  const handleReset = () => { setFilter({ typeCode: '', name: '', extension: '', isActive: '' }); fetchAssetTypes(); };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">자산유형 관리</h1>
      {/* 검색 영역 */}
      <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        <div className="grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">자산유형 ID</label>
          <input name="typeCode" className="col-span-2 border rounded px-2 py-1" value={filter.typeCode} onChange={handleFilterChange} placeholder="자산유형 ID" />
          <label className="col-span-1 text-sm">자산유형명</label>
          <input name="name" className="col-span-2 border rounded px-2 py-1" value={filter.name} onChange={handleFilterChange} placeholder="자산유형명" />
          <label className="col-span-1 text-sm">대표확장자</label>
          <input name="extension" className="col-span-2 border rounded px-2 py-1" value={filter.extension} onChange={handleFilterChange} placeholder="대표확장자" />
          <label className="col-span-1 text-sm">활성여부</label>
          <select name="isActive" className="col-span-2 border rounded px-2 py-1" value={filter.isActive} onChange={handleFilterChange}>
            <option value="">전체</option>
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button className="border p-2 rounded bg-white text-sm" type="button" onClick={() => { setEditItem(null); setShowModal(true); }}>+ 신규 등록</button>
            <button className="border p-2 rounded bg-white text-sm" type="button">엑셀 업로드</button>
            <button className="border p-2 rounded bg-white text-sm" type="button">엑셀 다운로드</button>
            <button className="border p-2 rounded bg-white text-sm text-red-600" type="button">선택 삭제</button>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-3 py-1 rounded">검색</button>
            <button type="button" className="border p-2 rounded bg-white text-sm" onClick={handleReset}>초기화</button>
          </div>
        </div>
      </form>
      {/* 리스트 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center"><input type="checkbox" /></th>
              <th className="border px-4 py-2">자산유형 ID</th>
              <th className="border px-4 py-2">자산유형명</th>
              <th className="border px-4 py-2">설명</th>
              <th className="border px-4 py-2">대표확장자</th>
              <th className="border px-4 py-2">활성여부</th>
              <th className="border px-4 py-2">생성일시</th>
              <th className="border px-4 py-2">생성자</th>
              <th className="border px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8">로딩 중...</td></tr>
            ) : assetTypes.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8">데이터가 없습니다</td></tr>
            ) : assetTypes.map(t => (
              <tr key={t.id}>
                <td className="border px-4 py-2 text-center"><input type="checkbox" /></td>
                <td className="border px-4 py-2">{t.typeCode}</td>
                <td className="border px-4 py-2">{t.name}</td>
                <td className="border px-4 py-2">{t.description}</td>
                <td className="border px-4 py-2">{t.extension}</td>
                <td className="border px-4 py-2">{t.isActive ? '활성' : '비활성'}</td>
                <td className="border px-4 py-2">{t.createdAt?.slice(0, 10)}</td>
                <td className="border px-4 py-2">{t.createdBy || '-'}</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => { setEditItem(t); setShowModal(true); }}>수정</button>
                  <button className="text-red-600 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 등록/수정 모달 (스캐폴딩) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[350px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-4">{editItem ? '자산유형 수정' : '자산유형 등록'}</h2>
            {/* 폼 필드: typeCode(신규), name, description, extension, isActive */}
            <form>
              {!editItem && <input name="typeCode" placeholder="자산유형 ID" className="border rounded p-2 mb-2 w-full text-sm" />}
              <input name="name" placeholder="자산유형명" className="border rounded p-2 mb-2 w-full text-sm" />
              <input name="description" placeholder="설명" className="border rounded p-2 mb-2 w-full text-sm" />
              <input name="extension" placeholder="대표확장자" className="border rounded p-2 mb-2 w-full text-sm" />
              <label className="flex items-center gap-2 mb-2">
                <input type="checkbox" name="isActive" /> 활성
              </label>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="border p-2 rounded bg-white text-sm">저장</button>
                <button type="button" className="border p-2 rounded bg-white text-sm" onClick={() => setShowModal(false)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 