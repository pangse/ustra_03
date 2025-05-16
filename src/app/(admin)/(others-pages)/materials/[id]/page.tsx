"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

interface Category {
  id: number;
  name: string;
  parentId?: number | null;
}
interface Material {
  id: number;
  name: string;
  categoryId: number;
  category: Category;
  locationId: number;
  location: MasterData;
  handlerId: number;
  handler: User;
  quantity: number;
  rfid_tag: string;
  inout_type: string;
  date: string;
  size?: string;
  color?: string;
  material?: string;
  brand?: string;
  model?: string;
  serial?: string;
  os?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  screen_size?: string;
  battery?: string;
  purchase_date?: string;
  warranty?: string;
  mac_address?: string;
  etc?: string;
}
interface MaterialHistory {
  id: number;
  materialId: number;
  type: string;
  quantity: number;
  date: string;
  handlerId: number;
  handler: { id: number; name: string };
  memo?: string;
}
interface MasterData {
  id: number;
  type: string;
  name: string;
}
interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  phone_number?: string;
}

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params && typeof params.id !== 'undefined' ? Number(params.id) : null;
  const [material, setMaterial] = useState<Material | null>(null);
  const [histories, setHistories] = useState<MaterialHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchMaterial = async () => {
    if (!id) return;
    setLoading(true);
    const res = await fetch(`/api/materials/${id}`);
    if (res.ok) setMaterial(await res.json());
    setLoading(false);
  };
  const fetchHistories = async () => {
    if (!id) return;
    setLoading(true);
    const res = await fetch(`/api/material-history`);
    if (res.ok) {
      const all = await res.json();
      setHistories(all.filter((h: MaterialHistory) => h.materialId === id));
    }
    setLoading(false);
  };
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  };
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  };

  useEffect(() => {
    if (!id) return;
    fetchMaterial();
    fetchHistories();
    fetchUsers();
    fetchCategories();
  }, [id]);

  const handleDeleteHistory = async (historyId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await fetch(`/api/material-history/${historyId}`, { method: "DELETE" });
    setLoading(false);
    fetchHistories();
  };

  if (!id) return <div className="p-8 text-center">잘못된 접근입니다.</div>;
  if (!material) return <div className="p-8 text-center">자산 정보를 불러오는 중...</div>;

  return (
    <div className="w-[85vw] max-w-7xl mx-auto p-4">
      <Button className="mb-4 text-blue-600 border-none bg-transparent" onClick={() => router.back()}>&larr; 목록으로</Button>
      <h1 className="text-2xl font-bold mb-2">{material.name}</h1>
      <div className="mb-4 grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded shadow">
        <div><b>카테고리:</b> {categories.find(c => c.id === material.categoryId)?.name || '-'}</div>
        <div><b>위치:</b> {material.location?.name}</div>
        <div><b>수량:</b> {material.quantity}</div>
        <div><b>입출고유형:</b> {material.inout_type}</div>
        <div><b>담당자:</b> {material.handler?.name}</div>
        <div><b>등록일:</b> {material.date?.slice(0, 10)}</div>
        <div><b>RFID:</b> {material.rfid_tag}</div>
        <div><b>사이즈:</b> {material.size || '-'}</div>
        <div><b>색상:</b> {material.color || '-'}</div>
        <div><b>소재:</b> {material.material || '-'}</div>
        <div><b>브랜드:</b> {material.brand || '-'}</div>
        <div><b>모델명:</b> {material.model || '-'}</div>
        <div><b>시리얼:</b> {material.serial || '-'}</div>
        <div><b>OS:</b> {material.os || '-'}</div>
        <div><b>CPU:</b> {material.cpu || '-'}</div>
        <div><b>RAM:</b> {material.ram || '-'}</div>
        <div><b>저장장치:</b> {material.storage || '-'}</div>
        <div><b>화면크기:</b> {material.screen_size || '-'}</div>
        <div><b>배터리:</b> {material.battery || '-'}</div>
        <div><b>구매일:</b> {material.purchase_date || '-'}</div>
        <div><b>보증기간:</b> {material.warranty || '-'}</div>
        <div><b>MAC주소:</b> {material.mac_address || '-'}</div>
        <div><b>기타:</b> {material.etc || '-'}</div>
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-2">입출고 이력</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">날짜</th>
            <th className="border px-2 py-1">유형</th>
            <th className="border px-2 py-1">수량</th>
            <th className="border px-2 py-1">담당자</th>
            <th className="border px-2 py-1">메모</th>
            <th className="border px-2 py-1">관리</th>
          </tr>
        </thead>
        <tbody>
          {histories.map(h => (
            <tr key={h.id}>
              <td className="border px-2 py-1">{h.date?.slice(0, 10)}</td>
              <td className="border px-2 py-1">{h.type}</td>
              <td className="border px-2 py-1">{h.quantity}</td>
              <td className="border px-2 py-1">{h.handler?.name}</td>
              <td className="border px-2 py-1">{h.memo}</td>
              <td className="border px-2 py-1">
                <Button
                  className="text-red-600 border-none bg-transparent"
                  onClick={() => handleDeleteHistory(h.id)}
                  disabled={loading}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 