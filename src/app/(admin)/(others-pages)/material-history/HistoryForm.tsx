import { useState, useEffect } from 'react';

interface Material {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
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

interface HistoryFormProps {
  materials: Material[];
  users: User[];
  initialData: MaterialHistory | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function HistoryForm({ materials, users, initialData, onSave, onCancel }: HistoryFormProps) {
  const [formData, setFormData] = useState({
    materialId: '',
    handlerId: '',
    type: '입고',
    quantity: 1,
    memo: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        materialId: initialData.materialId,
        handlerId: initialData.handlerId,
        type: initialData.type,
        quantity: initialData.quantity,
        memo: initialData.memo
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">자산</label>
        <select
          name="materialId"
          value={formData.materialId}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md bg-white w-full"
        >
          <option value="">자산 선택</option>
          {materials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">담당자</label>
        <select
          name="handlerId"
          value={formData.handlerId}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md bg-white w-full"
        >
          <option value="">담당자 선택</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">유형</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md bg-white w-full"
        >
          <option value="입고">입고</option>
          <option value="출고">출고</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">수량</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="1"
          className="px-4 py-2 border rounded-md bg-white w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">메모</label>
        <textarea
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          rows={3}
          className="px-4 py-2 border rounded-md bg-white w-full"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          저장
        </button>
      </div>
    </form>
  );
} 