import { useEffect, useState } from "react";

interface MasterData {
  id: number;
  type: string;
  name: string;
}
interface UserFormProps {
  initial?: {
    name?: string;
    email?: string;
    department?: string;
    role?: string;
    phone_number?: string;
  };
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function UserForm({ initial, onSave, onClose, loading }: UserFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    department: initial?.department || "",
    role: initial?.role || "",
    phone_number: initial?.phone_number || "",
  });
  const [departments, setDepartments] = useState<MasterData[]>([]);
  const [roles, setRoles] = useState<MasterData[]>([]);

  useEffect(() => {
    fetch("/api/masterdata?limit=1000").then(res => res.json()).then(res => {
      const data = res.data || res;
      setDepartments(data.filter((d: MasterData) => d.type === "부서"));
      setRoles(data.filter((d: MasterData) => d.type === "역할"));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="이름"
        className="border rounded px-2 py-1"
        required
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="이메일"
        className="border rounded px-2 py-1"
        required
        type="email"
      />
      <select
        name="department"
        value={form.department}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">부서 선택</option>
        {departments.map((d) => (
          <option key={d.id} value={d.name}>{d.name}</option>
        ))}
      </select>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">역할 선택</option>
        {roles.map((r) => (
          <option key={r.id} value={r.name}>{r.name}</option>
        ))}
      </select>
      <input
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
        placeholder="연락처"
        className="border rounded px-2 py-1"
        required
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-gray-900 text-white border border-gray-900 rounded px-3 py-1 text-sm" disabled={loading}>
          저장
        </button>
        <button type="button" className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 rounded px-3 py-1 text-sm" onClick={onClose}>취소</button>
      </div>
    </form>
  );
} 