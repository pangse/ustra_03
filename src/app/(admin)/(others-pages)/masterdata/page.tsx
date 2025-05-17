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
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">기준데이터 관리</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => { setPage(1); fetchData(1); }}
            disabled={loading}
          >
            조회
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            onClick={handleRegisterClick}
          >
            등록
          </button>
        </div>
      </div>

      <form className="mb-6 flex flex-wrap gap-2 items-center">
        <select
          name="type"
          value={filter.type}
          onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
          className="px-4 py-2 border rounded-md bg-white"
        >
          <option value="">전체 구분</option>
          {typeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          name="name"
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
          placeholder="이름 검색"
          className="px-4 py-2 border rounded-md bg-white"
        />
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">구분</th>
              <th className="px-4 py-2 border">이름</th>
              <th className="px-4 py-2 border">설명</th>
              <th className="px-4 py-2 border">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.type}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.description}</td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleEdit(item)}
                      disabled={loading}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 focus:outline-none"
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? "기준데이터 수정" : "기준데이터 등록"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">구분</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="form-select w-full"
                required
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">이름</label>
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="이름"
                className="form-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">설명</label>
              <input
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                placeholder="설명"
                className="form-input w-full"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => { setForm({ type: "카테고리" }); setEditingId(null); closeModal(); }}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {editingId ? "수정" : "등록"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {hasMore && (
        <div ref={loader} className="h-10 flex items-center justify-center">
          {loading && <span className="text-sm text-gray-500">로딩중...</span>}
        </div>
      )}
    </div>
  );
} 