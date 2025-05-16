"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

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

export default function MaterialNewPage() {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    locationId: "",
    handlerId: "",
    quantity: "1",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<MasterData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories").then(res => res.json()).then(setCategories);
    fetch("/api/masterdata?type=위치").then(res => res.json()).then(res => setLocations(res.data || res));
    fetch("/api/users").then(res => res.json()).then(setUsers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categoryId: Number(form.categoryId),
        locationId: Number(form.locationId),
        handlerId: Number(form.handlerId),
        quantity: Number(form.quantity),
      }),
    });
    setLoading(false);
    router.push("/admin/materials");
  };

  return (
    <div className="w-[85vw] max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">자산 등록</h1>
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="이름"
          className="border rounded px-2 py-1"
          required
        />
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
          <Button type="submit" className="bg-blue-600 text-white border-blue-600" disabled={loading}>
            등록
          </Button>
          <Button type="button" className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => router.push("/admin/materials")}>목록</Button>
        </div>
      </form>
    </div>
  );
} 