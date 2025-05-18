"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import UserForm from "./UserForm";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  phone_number: string;
}

interface MasterData {
  id: number;
  type: string;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { isOpen: modalOpen, openModal, closeModal } = useModal();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ name: '', email: '' });
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    setPage(page);
    try {
      const res = await fetch(`/api/users?page=${page}&filter=${JSON.stringify(filter)}`);
      const data = await res.json();
      const usersArr = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setUsers(usersArr);
      setFilteredUsers(usersArr);
    } catch {
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    openModal();
  };

  const handleRegisterClick = () => {
    setSelectedUser(null);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setLoading(false);
    fetchUsers(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setPage(1);
    fetchUsers(1);
  };

  // UserForm 저장 핸들러
  const handleSave = async (form: Partial<User>) => {
    setLoading(true);
    if (selectedUser) {
      await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setLoading(false);
    closeModal();
    setPage(1);
    fetchUsers(1);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">사용자 목록</h1>
      {/* 검색/액션 영역 */}
      <form className="bg-white rounded shadow p-4 mb-6 space-y-2" onSubmit={e => { e.preventDefault(); setPage(1); fetchUsers(1); }}>
        <div className="grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">이름</label>
          <input name="name" className="col-span-2 border rounded px-2 py-1" value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} placeholder="이름 검색" />
          <label className="col-span-1 text-sm">이메일</label>
          <input name="email" className="col-span-2 border rounded px-2 py-1" value={filter.email} onChange={e => setFilter(f => ({ ...f, email: e.target.value }))} placeholder="이메일 검색" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button type="button" className="border p-2 rounded bg-white text-sm" onClick={handleRegisterClick} disabled={loading}>사용자 등록</button>
            <button type="button" className="border p-2 rounded bg-white text-sm" onClick={() => { setPage(1); fetchUsers(1); }} disabled={loading}>{loading ? '로딩 중...' : '조회'}</button>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-3 py-1 rounded">검색</button>
            <button type="button" className="border p-2 rounded bg-white text-sm" onClick={() => { setFilter({ name: '', email: '' }); setPage(1); fetchUsers(1); }}>초기화</button>
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
              <th className="border px-4 py-2 text-center">이름</th>
              <th className="border px-4 py-2 text-center">이메일</th>
              <th className="border px-4 py-2 text-center">부서</th>
              <th className="border px-4 py-2 text-center">역할</th>
              <th className="border px-4 py-2 text-center">전화번호</th>
              <th className="border px-4 py-2 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && page === 1 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 border">로딩 중...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 border">데이터가 없습니다</td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id}>
                  <td className="border px-4 py-2 text-center">{u.name}</td>
                  <td className="border px-4 py-2 text-center">{u.email}</td>
                  <td className="border px-4 py-2 text-center">{u.department}</td>
                  <td className="border px-4 py-2 text-center">{u.role}</td>
                  <td className="border px-4 py-2 text-center">{u.phone_number}</td>
                  <td className="border px-4 py-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => handleEdit(u)}
                        disabled={loading}
                        className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id)}
                        disabled={loading}
                        className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete
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
        {filteredUsers.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">데이터가 없습니다</div>
        ) : loading && page === 1 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded shadow">로딩 중...</div>
        ) : (
          filteredUsers.map(u => (
            <div key={u.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="font-semibold text-base mb-1">{u.name}</div>
              <div className="text-xs text-gray-500 mb-1">이메일: <span className="text-gray-800">{u.email}</span></div>
              <div className="text-xs text-gray-500 mb-1">부서: <span className="text-gray-800">{u.department}</span></div>
              <div className="text-xs text-gray-500 mb-1">역할: <span className="text-gray-800">{u.role}</span></div>
              <div className="text-xs text-gray-500 mb-2">전화번호: <span className="text-gray-800">{u.phone_number}</span></div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleEdit(u)}
                  disabled={loading}
                  className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-blue-600 text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z" />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(u.id)}
                  disabled={loading}
                  className="rounded-full p-2 border border-transparent hover:bg-gray-100 flex items-center gap-1 text-red-600 text-xs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <UserForm
          user={selectedUser}
          onClose={closeModal}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
} 