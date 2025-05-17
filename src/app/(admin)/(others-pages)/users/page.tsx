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
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">사용자 목록</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setPage(1); fetchUsers(1); }}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            disabled={loading}
          >
            {loading ? '로딩 중...' : '조회'}
          </button>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            사용자 등록
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <form onSubmit={e => e.preventDefault()} className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          name="name"
          value={filter.name}
          onChange={handleFilterChange}
          placeholder="이름 검색"
          className="px-4 py-2 border rounded-md bg-white"
        />
        <input
          type="text"
          name="email"
          value={filter.email}
          onChange={handleFilterChange}
          placeholder="이메일 검색"
          className="px-4 py-2 border rounded-md bg-white"
        />
        <button 
          type="button" 
          onClick={() => { setPage(1); fetchUsers(1); }}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          disabled={loading}
        >
          초기화
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">이름</th>
              <th className="px-4 py-2 border">이메일</th>
              <th className="px-4 py-2 border">부서</th>
              <th className="px-4 py-2 border">역할</th>
              <th className="px-4 py-2 border">전화번호</th>
              <th className="px-4 py-2 border">관리</th>
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
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{u.name}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.department}</td>
                  <td className="px-4 py-2 border">{u.role}</td>
                  <td className="px-4 py-2 border">{u.phone_number}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(u)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700 focus:outline-none"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id)}
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

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <UserForm
          initial={selectedUser ?? undefined}
          onSave={handleSave}
          onClose={closeModal}
          loading={loading}
        />
      </Modal>
    </div>
  );
} 