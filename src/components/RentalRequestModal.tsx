import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface RentalRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RentalRequestForm) => void;
}

export interface RentalRequestForm {
  requester: string;
  assetName: string;
  arrivalDate: string;
  destination: string;
  rentalPeriod: string;
  quantity: number | "";
  memo?: string;
}

const initialForm: RentalRequestForm = {
  requester: "",
  assetName: "",
  arrivalDate: "",
  destination: "",
  rentalPeriod: "",
  quantity: "",
  memo: "",
};

const RentalRequestModal: React.FC<RentalRequestModalProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = React.useState<RentalRequestForm>(initialForm);
  const [errors, setErrors] = React.useState<{ [k: string]: string }>({});
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setForm(initialForm);
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
    if (!form.assetName.trim()) newErrors.assetName = "자산 이름을 입력하세요.";
    if (!form.destination.trim()) newErrors.destination = "도착지를 입력하세요.";
    if (!form.quantity || Number(form.quantity) <= 0) newErrors.quantity = "요청 수량을 입력하세요.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === "quantity" ? (value === "" ? "" : Number(value)) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(form);
      onClose();
      router.push('/admin/rental-management');
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
        <h2 className="text-lg font-bold mb-4">대여 요청</h2>
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
            <label className="block text-sm mb-1">자산 이름 <span className="text-red-500">*</span></label>
            <input
              name="assetName"
              className="border rounded px-4 py-2 w-full"
              value={form.assetName}
              onChange={handleChange}
              placeholder="예: 무대 의상 A"
            />
            {errors.assetName && <div className="text-xs text-red-500 mt-1">{errors.assetName}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">도착 희망일</label>
            <input
              name="arrivalDate"
              type="date"
              className="border rounded px-4 py-2 w-full"
              value={form.arrivalDate}
              onChange={handleChange}
              placeholder="mm/dd/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">도착지 <span className="text-red-500">*</span></label>
            <input
              name="destination"
              className="border rounded px-4 py-2 w-full"
              value={form.destination}
              onChange={handleChange}
              placeholder="도착지 입력"
            />
            {errors.destination && <div className="text-xs text-red-500 mt-1">{errors.destination}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">대여기간</label>
            <input
              name="rentalPeriod"
              className="border rounded px-4 py-2 w-full"
              value={form.rentalPeriod}
              onChange={handleChange}
              placeholder="예: 2025.06.10~2025.06.12"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">요청 수량 <span className="text-red-500">*</span></label>
            <input
              name="quantity"
              type="number"
              min={1}
              className="border rounded px-4 py-2 w-full"
              value={form.quantity}
              onChange={handleChange}
              placeholder="수량 입력"
            />
            {errors.quantity && <div className="text-xs text-red-500 mt-1">{errors.quantity}</div>}
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
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold">대여 요청</button>
            <button type="button" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-4 py-2 font-semibold" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalRequestModal; 