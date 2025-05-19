"use client";
import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

interface MasterData {
  id: number;
  type: string;
  name: string;
  description?: string;
}

const typeOptions = [
  { value: "카테고리", label: "카테고리" },
  { value: "위치", label: "위치" },
  { value: "부서", label: "부서" },
  { value: "역할", label: "역할" },
  { value: "상패종류", label: "상패종류" },
  { value: "입출고유형", label: "입출고유형" },
  { value: "대여상태", label: "대여상태" },
  { value: "자산상태", label: "자산상태" },
  { value: "사용자상태", label: "사용자상태" },
  { value: "알림유형", label: "알림유형" },
];

export default function MasterDataPage() {
  const [data, setData] = useState<MasterData[]>([]);
  const [form, setForm] = useState<Partial<MasterData>>({ type: "카테고리" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const { isOpen: modalOpen, openModal, closeModal } = useModal();
  const [filter, setFilter] = useState({ type: "", name: "" });

  const fetchData = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/masterdata?page=${pageNum}&limit=20`);
      if (!res.ok) {
        throw new Error('API Error: ' + res.status);
      }
      const response = await res.json();
      if (response.error) {
        throw new Error(response.error);
      }
      setData(prev => pageNum === 1 ? (response.data || []) : [...prev, ...(response.data || [])]);
      setHasMore(response.hasMore || false);
    } catch (error) {
      console.error('Error fetching masterdata:', error);
      setData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) setPage(p => p + 1);
    }, { threshold: 1 });
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await fetch(`/api/masterdata/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/masterdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ type: "카테고리" });
    setEditingId(null);
    setLoading(false);
    setPage(1);
    fetchData(1);
  };

  const handleEdit = (item: MasterData) => {
    setForm(item);
    setEditingId(item.id);
    openModal();
  };

  const handleRegisterClick = () => {
    setForm({ type: "카테고리" });
    setEditingId(null);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await fetch(`/api/masterdata/${id}`, { method: "DELETE" });
    setLoading(false);
    setPage(1);
    fetchData(1);
  };

  const filteredData = data.filter(item =>
    (!filter.type || item.type === filter.type) &&
    (!filter.name || item.name.includes(filter.name))
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">기준데이터 관리</h1>
      {/* 검색/액션 영역 */}
      <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => { e.preventDefault(); setPage(1); fetchData(1); }}>
        {/* 데스크탑: grid, 모바일: flex-col */}
        <div className="hidden md:grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">구분</label>
          <select name="type" className="col-span-2 border rounded px-2 py-1" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
            <option value="">전체 구분</option>
            {typeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="col-span-1 text-sm">이름</label>
          <input name="name" className="col-span-2 border rounded px-2 py-1" value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} placeholder="이름 검색" />
        </div>
        <div className="md:hidden flex flex-col gap-2">
          <label className="text-sm">구분</label>
          <select name="type" className="border rounded px-2 py-2 w-full" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
            <option value="">전체 구분</option>
            {typeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="text-sm mt-2">이름</label>
          <input name="name" className="border rounded px-2 py-2 w-full" value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} placeholder="이름 검색" />
        </div>
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          <div className="flex gap-2">
            <button type="button" className="border p-2 rounded bg-white text-sm w-full md:w-auto" onClick={handleRegisterClick}>등록</button>
            <button type="button" className="border p-2 rounded bg-white text-sm w-full md:w-auto" onClick={() => { setPage(1); fetchData(1); }} disabled={loading}>조회</button>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-3 py-2 rounded w-full md:w-auto">검색</button>
            <button type="button" className="border p-2 rounded bg-white text-sm w-full md:w-auto" onClick={() => { setFilter({ type: '', name: '' }); setPage(1); fetchData(1); }}>초기화</button>
          </div>
        </div>
      </form>

      {/* 데스크탑: 테이블 */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-center">구분</th>
              <th className="border px-2 py-2 text-center">이름</th>
              <th className="border px-2 py-2 text-center">설명</th>
              <th className="border px-2 py-2 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-2 text-center">{item.type}</td>
                <td className="border px-2 py-2 text-center">{item.name}</td>
                <td className="border px-2 py-2 text-center">{item.description}</td>
                <td className="border px-2 py-2 text-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600"
                      onClick={() => handleEdit(item)}
                      disabled={loading}
                      aria-label="수정"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                      </svg>
                      수정
                    </button>
                    <button
                      type="button"
                      className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-red-600"
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      aria-label="삭제"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 모바일: 카드 리스트 */}
      <div className="block md:hidden space-y-4">
        {filteredData.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">데이터가 없습니다</div>
        ) : loading && page === 1 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">로딩 중...</div>
        ) : (
          filteredData.map(item => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="font-semibold text-base mb-1">{item.type}</div>
              <div className="text-xs text-gray-500 mb-1">이름: <span className="text-gray-800">{item.name}</span></div>
              <div className="text-xs text-gray-500 mb-2">설명: <span className="text-gray-800">{item.description}</span></div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600 text-xs"
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                  aria-label="수정"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                  </svg>
                  수정
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-red-600 text-xs"
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                  aria-label="삭제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div ref={loader} className="h-10" />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <form onSubmit={handleSubmit}>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded p-2 mb-2 w-full text-sm bg-white"
          >
            {typeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            placeholder="이름"
            className="border rounded p-2 mb-2 w-full text-sm bg-white"
          />
          <input
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            placeholder="설명"
            className="border rounded p-2 mb-2 w-full text-sm bg-white"
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="border p-2 rounded bg-white text-sm">저장</button>
            <button type="button" className="border p-2 rounded bg-white text-sm" onClick={closeModal}>취소</button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 