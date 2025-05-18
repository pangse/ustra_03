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
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => { setPage(1); fetchMaterials(1); }}
          className="border p-2 rounded bg-white text-sm"
          disabled={loading}
        >
          {loading ? '로딩 중...' : '조회'}
        </button>
        <button
          type="button"
          onClick={handleRegisterClick}
          className="border p-2 rounded bg-white text-sm"
          disabled={loading}
        >
          자산 등록
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={e => e.preventDefault()} className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          name="name"
          value={filter.name}
          onChange={handleFilterChange}
          placeholder="자산명 검색"
          className="border rounded p-2 text-sm bg-white"
        />
        <select
          name="categoryId"
          value={filter.categoryId}
          onChange={handleFilterChange}
          className="border rounded p-2 text-sm bg-white"
        >
          <option value="">카테고리 전체</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          name="locationId"
          value={filter.locationId}
          onChange={handleFilterChange}
          className="border rounded p-2 text-sm bg-white"
        >
          <option value="">위치 전체</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <select
          name="handlerId"
          value={filter.handlerId}
          onChange={handleFilterChange}
          className="border rounded p-2 text-sm bg-white"
        >
          <option value="">담당자 전체</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <button 
          type="button" 
          onClick={() => { setPage(1); fetchMaterials(1); }}
          className="border p-2 rounded bg-white text-sm"
          disabled={loading}
        >
          초기화
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">자산명</th>
              <th className="border px-4 py-2">카테고리</th>
              <th className="border px-4 py-2">위치</th>
              <th className="border px-4 py-2">담당자</th>
              <th className="border px-4 py-2">RFID</th>
              <th className="border px-4 py-2">수량</th>
              <th className="border px-4 py-2">상태</th>
              <th className="border px-4 py-2">관리</th>
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
                  <td className="border px-4 py-2">{m.name}</td>
                  <td className="border px-4 py-2">{m.category?.name || '-'}</td>
                  <td className="border px-4 py-2">{m.location?.name || '-'}</td>
                  <td className="border px-4 py-2">{m.handler?.name || '-'}</td>
                  <td className="border px-4 py-2">{m.rfid_tag}</td>
                  <td className="border px-4 py-2">{m.quantity}</td>
                  <td className="border px-4 py-2">{m.status}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(m)}
                        disabled={loading}
                        className="text-blue-600 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        disabled={loading}
                        className="text-red-600 hover:underline"
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