"use client";
import { useEffect, useState } from "react";
import { BoxCubeIcon } from "@/icons";

interface Material {
  id: number;
  name: string;
  category: string;
  status?: string;
}

export default function MobileRentPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selected, setSelected] = useState<Material | null>(null);
  const [form, setForm] = useState({ period: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/materials?page=1&limit=20")
      .then(res => res.json())
      .then(setMaterials);
  }, []);

  const handleRequest = async () => {
    setLoading(true);
    await fetch("/api/rental", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        materialId: selected?.id,
        period: form.period,
        reason: form.reason,
      }),
    });
    setLoading(false);
    setToast("대여 요청이 접수되었습니다!");
    setSelected(null);
    setForm({ period: "", reason: "" });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="max-w-xs mx-auto min-h-screen bg-gray-50 p-2">
      <h1 className="text-xl font-bold mb-4 text-center">자산 대여 요청</h1>
      <div className="space-y-2">
        {materials.map(m => (
          <div key={m.id} className="flex items-center gap-3 bg-white rounded shadow p-3">
            <BoxCubeIcon className="w-6 h-6 text-gray-400" />
            <div className="flex-1">
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-gray-500">{m.category}</div>
            </div>
            <button
              className="bg-blue-600 text-white text-xs rounded px-3 py-1"
              onClick={() => setSelected(m)}
              disabled={loading || (m.status ? m.status !== "정상" : false)}
            >
              대여 요청
            </button>
          </div>
        ))}
      </div>
      {/* 대여 요청 폼 모달 */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={e => { e.preventDefault(); handleRequest(); }}
            className="bg-white rounded shadow p-6 w-full max-w-xs space-y-3"
          >
            <h2 className="text-lg font-bold mb-2">{selected.name} 대여 요청</h2>
            <input
              type="text"
              placeholder="대여 기간(예: 2024-07-01 ~ 2024-07-03)"
              value={form.period}
              onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="대여 사유"
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              className="border p-2 rounded w-full"
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>요청</button>
              <button type="button" onClick={() => setSelected(null)} className="bg-gray-300 px-4 py-2 rounded">취소</button>
            </div>
          </form>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
} 