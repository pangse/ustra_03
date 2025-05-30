"use client";
import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import HistoryForm from "./HistoryForm";
import { useRouter } from 'next/navigation';

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
  email: string;
}

interface MaterialHistory {
  id: number;
  materialId: number;
  handlerId: number;
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
    materialId: 0,
    handlerId: 0,
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
    setFilters(prev => ({ ...prev, [name]: Number(value) }));
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

  const handleDelete = async (id: number) => {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-4">자산 이력 관리</h1>
      {/* 검색/액션 영역 */}
      <form
        className="bg-white rounded shadow p-4 mb-6 space-y-2"
        onSubmit={e => { e.preventDefault(); /* 검색 로직은 상태로 필터링 */ }}
      >
        {/* 데스크탑: grid, 모바일: flex-col */}
        <div className="hidden md:grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">자산</label>
          <select
            name="materialId"
            className="col-span-2 border rounded px-2 py-1"
            value={filters.materialId}
            onChange={e => setFilters(prev => ({ ...prev, materialId: Number(e.target.value) }))}
          >
            <option value={0}>전체</option>
            {materials.map(material => (
              <option key={material.id} value={material.id}>{material.name}</option>
            ))}
          </select>
          <label className="col-span-1 text-sm">담당자</label>
          <select
            name="handlerId"
            className="col-span-2 border rounded px-2 py-1"
            value={filters.handlerId}
            onChange={e => setFilters(prev => ({ ...prev, handlerId: Number(e.target.value) }))}
          >
            <option value={0}>전체</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <label className="col-span-1 text-sm">유형</label>
          <select
            name="type"
            className="col-span-2 border rounded px-2 py-1"
            value={filters.type}
            onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">전체</option>
            <option value="입고">입고</option>
            <option value="출고">출고</option>
          </select>
        </div>
        <div className="md:hidden flex flex-col gap-2">
          <label className="text-sm">자산</label>
          <select
            name="materialId"
            className="border rounded px-2 py-2 w-full"
            value={filters.materialId}
            onChange={e => setFilters(prev => ({ ...prev, materialId: Number(e.target.value) }))}
          >
            <option value={0}>전체</option>
            {materials.map(material => (
              <option key={material.id} value={material.id}>{material.name}</option>
            ))}
          </select>
          <label className="text-sm mt-2">담당자</label>
          <select
            name="handlerId"
            className="border rounded px-2 py-2 w-full"
            value={filters.handlerId}
            onChange={e => setFilters(prev => ({ ...prev, handlerId: Number(e.target.value) }))}
          >
            <option value={0}>전체</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <label className="text-sm mt-2">유형</label>
          <select
            name="type"
            className="border rounded px-2 py-2 w-full"
            value={filters.type}
            onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">전체</option>
            <option value="입고">입고</option>
            <option value="출고">출고</option>
          </select>
        </div>
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="border p-2 rounded bg-white text-sm w-full md:w-auto"
              onClick={() => {
                setEditingHistory(null);
                setIsModalOpen(true);
              }}
            >
              이력 등록
            </button>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-3 py-2 rounded w-full md:w-auto">검색</button>
            <button
              type="button"
              className="border p-2 rounded bg-white text-sm w-full md:w-auto"
              onClick={() => setFilters({ materialId: 0, handlerId: 0, type: '' })}
            >
              초기화
            </button>
          </div>
        </div>
      </form>

      {/* 데스크탑: 테이블 */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border text-sm bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-center">날짜</th>
              <th className="border px-2 py-2 text-center">자산</th>
              <th className="border px-2 py-2 text-center">유형</th>
              <th className="border px-2 py-2 text-center">수량</th>
              <th className="border px-2 py-2 text-center">담당자</th>
              <th className="border px-2 py-2 text-center">메모</th>
              <th className="border px-2 py-2 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistories.map((history) => (
              <tr key={history.id}>
                <td className="border px-2 py-2 text-center">{new Date(history.date).toLocaleString()}</td>
                <td className="border px-2 py-2 text-center">{history.material?.name}</td>
                <td className="border px-2 py-2 text-center">{history.type}</td>
                <td className="border px-2 py-2 text-center">{history.quantity}</td>
                <td className="border px-2 py-2 text-center">{history.handler?.name}</td>
                <td className="border px-2 py-2 text-center">{history.memo}</td>
                <td className="border px-2 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(history)}
                      className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600 mr-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                      </svg>
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(history.id)}
                      className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-red-600"
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
        {filteredHistories.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">데이터가 없습니다</div>
        ) : loading && page === 1 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">로딩 중...</div>
        ) : (
          filteredHistories.map(history => (
            <div key={history.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="font-semibold text-base mb-1">{new Date(history.date).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mb-1">자산: <span className="text-gray-800">{history.material?.name}</span></div>
              <div className="text-xs text-gray-500 mb-1">유형: <span className="text-gray-800">{history.type}</span></div>
              <div className="text-xs text-gray-500 mb-1">수량: <span className="text-gray-800">{history.quantity}</span></div>
              <div className="text-xs text-gray-500 mb-1">담당자: <span className="text-gray-800">{history.handler?.name}</span></div>
              <div className="text-xs text-gray-500 mb-2">메모: <span className="text-gray-800">{history.memo}</span></div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleEdit(history)}
                  className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600 text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                  </svg>
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(history.id)}
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