import React, { useEffect, useRef } from "react";

export interface RepairLaundry {
  id: number;
  assetId: string;
  name: string;
  type: string;
  requestDate: string;
  processType: string; // '수선' or '세탁'
  status: string;
  handler: string;
  location: string;
  memo?: string;
}

interface RepairRequestModalProps {
  open: boolean;
  onClose: () => void;
  selectedRepairs: RepairLaundry[];
}

const RepairRequestModal: React.FC<RepairRequestModalProps> = ({ open, onClose, selectedRepairs }) => {
  const [form, setForm] = React.useState({
    requester: "",
    memo: "",
  });
  const [errors, setErrors] = React.useState<{ [k: string]: string }>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setForm({ requester: "", memo: "" });
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.requester.trim()) newErrors.requester = "요청인을 입력하세요.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // 실제 저장 로직은 필요시 구현
      onClose();
      alert("수선 요청 완료!\n" + selectedRepairs.map(r => `${r.name} (${r.assetId}) - ${r.location} [${r.processType}]`).join("\n"));
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
        <h2 className="text-lg font-bold mb-4">수선 요청</h2>
        {selectedRepairs && selectedRepairs.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">선택된 수선 항목</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {selectedRepairs.map(r => (
                <li key={r.id}>{r.name} ({r.assetId}) - {r.location} [{r.processType}]</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">요청인 <span className="text-red-500">*</span></label>
            <input
              name="requester"
              className="border rounded px-4 py-2 w-full"
              value={form.requester}
              onChange={handleChange}
              placeholder="이름 입력"
              autoFocus
            />
            {errors.requester && <div className="text-xs text-red-500 mt-1">{errors.requester}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">메모</label>
            <input
              name="memo"
              className="border rounded px-4 py-2 w-full"
              value={form.memo}
              onChange={handleChange}
              placeholder="요청 사항을 입력하세요"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold">수선 요청</button>
            <button type="button" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-4 py-2 font-semibold" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairRequestModal; 