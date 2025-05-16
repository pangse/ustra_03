import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}
interface MasterData {
  id: number;
  type: string;
  name: string;
}
interface User {
  id: number;
  name: string;
}
interface MaterialFormProps {
  initial?: {
    name?: string;
    assetTypeId?: string | number;
    categoryId?: string | number;
    locationId?: string | number;
    handlerId?: string | number;
    quantity?: string | number;
  };
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function MaterialForm({ initial, onSave, onClose, loading }: MaterialFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    assetTypeId: initial?.assetTypeId ? String(initial.assetTypeId) : "",
    categoryId: initial?.categoryId ? String(initial.categoryId) : "",
    locationId: initial?.locationId ? String(initial.locationId) : "",
    handlerId: initial?.handlerId ? String(initial.handlerId) : "",
    quantity: initial?.quantity ? String(initial.quantity) : "1",
  });
  const [assetTypes, setAssetTypes] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<MasterData[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/asset-types").then(res => res.json()).then(data => setAssetTypes(Array.isArray(data) ? data : []));
    fetch("/api/masterdata?type=카테고리&limit=1000").then(res => res.json()).then(res => setCategories(res.data || res));
    fetch("/api/masterdata?type=위치&limit=1000").then(res => res.json()).then(res => setLocations(res.data || res));
    fetch("/api/users").then(res => res.json()).then(setUsers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...form,
      assetTypeId: Number(form.assetTypeId),
      categoryId: Number(form.categoryId),
      locationId: Number(form.locationId),
      handlerId: Number(form.handlerId),
      quantity: Number(form.quantity),
    });
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
      <select
        name="assetTypeId"
        value={form.assetTypeId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">자산유형 선택</option>
        {assetTypes.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">카테고리 선택</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select
        name="locationId"
        value={form.locationId}
        onChange={handleChange}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">위치 선택</option>
        {locations.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
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
        name="quantity"
        type="number"
        min={1}
        value={form.quantity}
        onChange={handleChange}
        placeholder="수량"
        className="border rounded px-2 py-1"
        required
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