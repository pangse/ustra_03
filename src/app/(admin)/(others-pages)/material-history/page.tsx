"use client";
import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import HistoryForm from "./HistoryForm";

interface Material {
  id: number;
  name: string;
  category?: { id: number; name: string };
  brand?: string;
  model?: string;
  serial?: string;
}

interface User {
  id: number;
  name: string;
}

interface MaterialHistory {
  id: number;
  materialId: number;
  material: Material;
  type: string;
  quantity: number;
  date: string;
  handlerId: number;
  handler: User;
  memo?: string;
}

export default function MaterialHistoryPage() {
  const [histories, setHistories] = useState<MaterialHistory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const { isOpen: modalOpen, openModal, closeModal } = useModal();
  const [selectedHistory, setSelectedHistory] = useState<MaterialHistory | null>(null);
  const [filter, setFilter] = useState({ materialId: "", handlerId: "", type: "" });

  const fetchHistories = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/material-history?page=${pageNum}&limit=20`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch histories');
      }
      const data = await res.json();
      if (!data || !Array.isArray(data.histories)) {
        throw new Error('Invalid response format from server');
      }
      setHistories(prev => pageNum === 1 ? data.histories : [...prev, ...data.histories]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error fetching histories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch histories');
      setHistories([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch materials');
      }
      const data = await res.json();
      setMaterials(data.materials || []);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch materials');
      setMaterials([]);
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
    fetchHistories(page);
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
    fetchMaterials();
    fetchUsers();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleEdit = (history: MaterialHistory) => {
    setSelectedHistory(history);
    openModal();
  };

  const handleRegisterClick = () => {
    setSelectedHistory(null);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/material-history/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete history');
      }
      setPage(1);
      fetchHistories(1);
    } catch (err) {
      console.error('Error deleting history:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistories = histories.filter(h =>
    (!filter.materialId || h.materialId === Number(filter.materialId)) &&
    (!filter.handlerId || h.handlerId === Number(filter.handlerId)) &&
    (!filter.type || h.type === filter.type)
  );

  return (
    <div className="w-[85vw] max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
        입출고 이력
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setPage(1); fetchHistories(1); }}
            className="px-4 py-2 text-sm font-medium"
            disabled={loading}
          >
            {loading ? '로딩 중...' : '조회'}
          </button>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="px-4 py-2 text-sm font-medium"
            disabled={loading}
          >
            입출고 등록
          </button>
        </div>
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <form onSubmit={e => e.preventDefault()} className="mb-4">
        <select
          name="materialId"
          value={filter.materialId}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">자산 전체</option>
          {materials.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <select
          name="handlerId"
          value={filter.handlerId}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">담당자 전체</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <select
          name="type"
          value={filter.type}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">유형 전체</option>
          <option value="IN">입고</option>
          <option value="OUT">출고</option>
        </select>
        <button 
          type="button" 
          onClick={() => { setPage(1); fetchHistories(1); }}
          className="px-4 py-2 text-sm font-medium"
          disabled={loading}
        >
          초기화
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">자산</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">메모</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && page === 1 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  로딩 중...
                </td>
              </tr>
            ) : filteredHistories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              filteredHistories.map(h => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{h.material?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{h.type === 'IN' ? '입고' : '출고'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{h.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(h.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{h.handler?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{h.memo || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(h)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 focus:outline-none"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(h.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 focus:outline-none"
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
        <HistoryForm
          history={selectedHistory}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            setPage(1);
            fetchHistories(1);
          }}
        />
      </Modal>
    </div>
  );
} 