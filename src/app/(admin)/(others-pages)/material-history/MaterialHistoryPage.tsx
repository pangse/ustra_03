"use client";
import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import HistoryForm from "./HistoryForm";
import { useRouter } from 'next/navigation';

interface Material {
  id: string;
  name: string;
  category?: { id: number; name: string };
  brand?: string;
  model?: string;
  serial?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface MaterialHistory {
  id: string;
  materialId: string;
  handlerId: string;
  type: string;
  quantity: number;
  date: string;
  memo: string;
  material: Material;
  handler: User;
}

export default function MaterialHistoryPage() {
  const router = useRouter();
  const [histories, setHistories] = useState<MaterialHistory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHistory, setEditingHistory] = useState<MaterialHistory | null>(null);
  const [filters, setFilters] = useState({
    materialId: '',
    handlerId: '',
    type: ''
  });

  const observerTarget = useRef<HTMLDivElement>(null);
  const { isOpen: modalOpen, openModal, closeModal } = useModal();

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
      console.log('Fetched histories:', data);
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
      console.log('Fetched materials:', data);
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
      console.log('Fetched users:', data);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [historiesRes, materialsRes, usersRes] = await Promise.all([
          fetch('/api/material-history?page=1&limit=20'),
          fetch('/api/materials'),
          fetch('/api/users')
        ]);

        if (!historiesRes.ok || !materialsRes.ok || !usersRes.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const [historiesData, materialsData, usersData] = await Promise.all([
          historiesRes.json(),
          materialsRes.json(),
          usersRes.json()
        ]);

        console.log('Fetched histories:', historiesData);
        console.log('Fetched materials:', materialsData);
        console.log('Fetched users:', usersData);

        setHistories(historiesData.histories || []);
        setMaterials(materialsData.materials || []);
        setUsers(usersData.users || []);
        setHasMore(historiesData.hasMore);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          try {
            setLoading(true);
            const response = await fetch(`/api/material-history?page=${nextPage}&limit=20`);
            if (!response.ok) throw new Error('Failed to fetch more histories');
            
            const data = await response.json();
            setHistories(prev => [...prev, ...data.histories]);
            setHasMore(data.hasMore);
            setPage(nextPage);
          } catch (err) {
            console.error('Error fetching more histories:', err);
            setError(err instanceof Error ? err.message : '추가 데이터를 불러오는데 실패했습니다.');
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredHistories = histories.filter(history => {
    if (filters.materialId && history.materialId !== filters.materialId) return false;
    if (filters.handlerId && history.handlerId !== filters.handlerId) return false;
    if (filters.type && history.type !== filters.type) return false;
    return true;
  });

  const handleEdit = (history: MaterialHistory) => {
    setEditingHistory(history);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 이력을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/material-history/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete history');

      setHistories(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error('Error deleting history:', err);
      alert('이력 삭제에 실패했습니다.');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const url = editingHistory 
        ? `/api/material-history/${editingHistory.id}`
        : '/api/material-history';
      
      const response = await fetch(url, {
        method: editingHistory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save history');

      const savedHistory = await response.json();
      
      if (editingHistory) {
        setHistories(prev => 
          prev.map(h => h.id === savedHistory.id ? savedHistory : h)
        );
      } else {
        setHistories(prev => [savedHistory, ...prev]);
      }

      setIsModalOpen(false);
      setEditingHistory(null);
    } catch (err) {
      console.error('Error saving history:', err);
      alert('이력 저장에 실패했습니다.');
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">자산 이력 관리</h1>
        <button
          onClick={() => {
            setEditingHistory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          이력 등록
        </button>
      </div>

      {/* 필터 */}
      <form className="mb-6 flex flex-wrap gap-2 items-center">
        <select
          name="materialId"
          value={filters.materialId}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md bg-white"
        >
          <option value="">자산 선택</option>
          {materials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>

        <select
          name="handlerId"
          value={filters.handlerId}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md bg-white"
        >
          <option value="">담당자 선택</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded-md bg-white"
        >
          <option value="">유형 선택</option>
          <option value="입고">입고</option>
          <option value="출고">출고</option>
        </select>
      </form>

      {/* 이력 목록 */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">날짜</th>
              <th className="px-4 py-2 border">자산</th>
              <th className="px-4 py-2 border">유형</th>
              <th className="px-4 py-2 border">수량</th>
              <th className="px-4 py-2 border">담당자</th>
              <th className="px-4 py-2 border">메모</th>
              <th className="px-4 py-2 border">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistories.map((history) => (
              <tr key={history.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{new Date(history.date).toLocaleString()}</td>
                <td className="px-4 py-2 border">{history.material?.name}</td>
                <td className="px-4 py-2 border">{history.type}</td>
                <td className="px-4 py-2 border">{history.quantity}</td>
                <td className="px-4 py-2 border">{history.handler?.name}</td>
                <td className="px-4 py-2 border">{history.memo}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(history)}
                    className="text-blue-600 hover:text-blue-700 focus:outline-none mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(history.id)}
                    className="text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 무한 스크롤 감지 요소 */}
      <div ref={observerTarget} className="h-10" />

      {/* 로딩 표시 */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingHistory ? '이력 수정' : '이력 등록'}
            </h2>
            <HistoryForm
              materials={materials}
              users={users}
              initialData={editingHistory}
              onSave={handleSave}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingHistory(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 