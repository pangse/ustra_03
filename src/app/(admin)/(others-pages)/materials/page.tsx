"use client";
import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import MaterialForm from "./MaterialForm";

interface Category {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Material {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  locationId: number;
  location?: Location;
  handlerId: number;
  handler?: User;
  rfid_tag: string;
  quantity: number;
  status: string;
  brand?: string;
  model?: string;
  serial?: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const { isOpen: modalOpen, openModal, closeModal } = useModal();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [filter, setFilter] = useState({ name: "", categoryId: "", locationId: "", handlerId: "" });

  const fetchMaterials = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/materials?page=${pageNum}&limit=20`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch materials');
      }
      const data = await res.json();
      setMaterials(prev => pageNum === 1 ? data.materials : [...prev, ...data.materials]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch materials');
      setMaterials([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch locations');
      }
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      setLocations([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchMaterials(page);
  }, [page]);

  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) setPage(p => p + 1);
    }, { threshold: 1 });
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    fetchCategories();
    fetchLocations();
    fetchUsers();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    openModal();
  };

  const handleRegisterClick = () => {
    setSelectedMaterial(null);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete material');
      }
      setPage(1);
      fetchMaterials(1);
    } catch (err) {
      console.error('Error deleting material:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete material');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m =>
    (!filter.name || m.name.toLowerCase().includes(filter.name.toLowerCase())) &&
    (!filter.categoryId || m.categoryId === Number(filter.categoryId)) &&
    (!filter.locationId || m.locationId === Number(filter.locationId)) &&
    (!filter.handlerId || m.handlerId === Number(filter.handlerId))
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">자산 관리</h1>
      {/* 검색/액션 영역 */}
      <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => { e.preventDefault(); setPage(1); fetchMaterials(1); }}>
        {/* 데스크탑: grid, 모바일: flex-col */}
        <div className="hidden md:grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">자산명</label>
          <input name="name" className="col-span-2 border rounded px-2 py-1" value={filter.name} onChange={handleFilterChange} placeholder="자산명 입력" />
          <label className="col-span-1 text-sm">카테고리</label>
          <select name="categoryId" className="col-span-2 border rounded px-2 py-1" value={filter.categoryId} onChange={handleFilterChange}>
            <option value="">전체</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="col-span-1 text-sm">위치</label>
          <select name="locationId" className="col-span-2 border rounded px-2 py-1" value={filter.locationId} onChange={handleFilterChange}>
            <option value="">전체</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <label className="col-span-1 text-sm">담당자</label>
          <select name="handlerId" className="col-span-2 border rounded px-2 py-1" value={filter.handlerId} onChange={handleFilterChange}>
            <option value="">전체</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="md:hidden flex flex-col gap-2">
          <label className="text-sm">자산명</label>
          <input name="name" className="border rounded px-2 py-2 w-full" value={filter.name} onChange={handleFilterChange} placeholder="자산명 입력" />
          <label className="text-sm mt-2">카테고리</label>
          <select name="categoryId" className="border rounded px-2 py-2 w-full" value={filter.categoryId} onChange={handleFilterChange}>
            <option value="">전체</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="text-sm mt-2">위치</label>
          <select name="locationId" className="border rounded px-2 py-2 w-full" value={filter.locationId} onChange={handleFilterChange}>
            <option value="">전체</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <label className="text-sm mt-2">담당자</label>
          <select name="handlerId" className="border rounded px-2 py-2 w-full" value={filter.handlerId} onChange={handleFilterChange}>
            <option value="">전체</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          <div className="flex gap-2">
            <button type="button" className="border p-2 rounded bg-white text-sm w-full md:w-auto" onClick={handleRegisterClick} disabled={loading}>등록</button>
            <button type="button" className="border p-2 rounded bg-white text-sm w-full md:w-auto" onClick={() => { setPage(1); fetchMaterials(1); }} disabled={loading}>{loading ? '로딩 중...' : '조회'}</button>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-3 py-2 rounded w-full md:w-auto">검색</button>
            <button type="button" className="border p-2 rounded bg-white text-sm w-full md:w-auto" onClick={() => { setFilter({ name: '', categoryId: '', locationId: '', handlerId: '' }); setPage(1); fetchMaterials(1); }}>초기화</button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 데스크탑: 테이블 */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-center">자산명</th>
              <th className="border px-2 py-2 text-center">카테고리</th>
              <th className="border px-2 py-2 text-center">위치</th>
              <th className="border px-2 py-2 text-center">담당자</th>
              <th className="border px-2 py-2 text-center">RFID</th>
              <th className="border px-2 py-2 text-center">수량</th>
              <th className="border px-2 py-2 text-center">상태</th>
              <th className="border px-2 py-2 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && page === 1 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 border">로딩 중...</td>
              </tr>
            ) : filteredMaterials.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 border">데이터가 없습니다</td>
              </tr>
            ) : (
              filteredMaterials.map(m => (
                <tr key={m.id}>
                  <td className="border px-2 py-2 text-center">{m.name}</td>
                  <td className="border px-2 py-2 text-center">{m.category?.name || '-'}</td>
                  <td className="border px-2 py-2 text-center">{m.location?.name || '-'}</td>
                  <td className="border px-2 py-2 text-center">{m.handler?.name || '-'}</td>
                  <td className="border px-2 py-2 text-center">{m.rfid_tag}</td>
                  <td className="border px-2 py-2 text-center">{m.quantity}</td>
                  <td className="border px-2 py-2 text-center">{m.status}</td>
                  <td className="border px-2 py-2 text-center">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(m)}
                        disabled={loading}
                        className="px-2 py-1 rounded text-xs font-medium border border-blue-600 text-blue-600 hover:bg-gray-100"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        disabled={loading}
                        className="px-2 py-1 rounded text-xs font-medium border border-red-600 text-red-600 hover:bg-gray-100"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* 모바일: 카드 리스트 */}
      <div className="block md:hidden space-y-4">
        {filteredMaterials.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">데이터가 없습니다</div>
        ) : loading && page === 1 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">로딩 중...</div>
        ) : (
          filteredMaterials.map(m => (
            <div key={m.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="font-semibold text-base mb-1">{m.name}</div>
              <div className="text-xs text-gray-500 mb-1">카테고리: <span className="text-gray-800">{m.category?.name || '-'}</span></div>
              <div className="text-xs text-gray-500 mb-1">위치: <span className="text-gray-800">{m.location?.name || '-'}</span></div>
              <div className="text-xs text-gray-500 mb-1">담당자: <span className="text-gray-800">{m.handler?.name || '-'}</span></div>
              <div className="text-xs text-gray-500 mb-1">RFID: <span className="text-gray-800">{m.rfid_tag}</span></div>
              <div className="text-xs text-gray-500 mb-1">수량: <span className="text-gray-800">{m.quantity}</span></div>
              <div className="text-xs text-gray-500 mb-2">상태: <span className="text-gray-800">{m.status}</span></div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleEdit(m)}
                  disabled={loading}
                  className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600 text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                  </svg>
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  disabled={loading}
                  className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-red-600 text-xs"
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
        <MaterialForm
          material={selectedMaterial}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            setPage(1);
            fetchMaterials(1);
          }}
        />
      </Modal>
    </div>
  );
} 