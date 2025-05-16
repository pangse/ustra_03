import { useEffect, useState } from "react";

interface Material {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
}
interface HistoryFormProps {
  initial?: {
    materialId?: string | number;
    type?: string;
    quantity?: string | number;
    handlerId?: string | number;
    memo?: string;
  };
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function HistoryForm({ initial, onSave, onClose, loading }: HistoryFormProps) {
  const [form, setForm] = useState({
    materialId: initial?.materialId ? String(initial.materialId) : "",
    type: initial?.type || "IN",
    quantity: initial?.quantity ? String(initial.quantity) : "1",
    handlerId: initial?.handlerId ? String(initial.handlerId) : "",
    memo: initial?.memo || "",
  });
  const [materials, setMaterials] = useState<Material[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/materials").then(res => res.json()).then(res => setMaterials(res.materials || res));
    fetch("/api/users").then(res => res.json()).then(setUsers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...form,
      materialId: Number(form.materialId),
      handlerId: Number(form.handlerId),
      quantity: Number(form.quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <select
        name="materialId"
        value={form.materialId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">자산 선택</option>
        {materials.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="IN">입고</option>
        <option value="OUT">출고</option>
        <option value="이동">이동</option>
      </select>
      <input
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={handleChange}
        placeholder="수량"
        className="border rounded px-2 py-1"
        required
      />
      <select
        name="handlerId"
        value={form.handlerId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">담당자 선택</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <input
        name="memo"
        value={form.memo}
        onChange={handleChange}
        placeholder="메모"
        className="border rounded px-2 py-1"
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-gray-900 text-white border border-gray-900 rounded px-3 py-1 text-sm" disabled={loading}>
          저장
        </button>
        <button type="button" className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 rounded px-3 py-1 text-sm" onClick={onClose}>
          취소
        </button>
      </div>
    </form>
  );
} 