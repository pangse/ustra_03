import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface RentalRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RentalRequestForm) => void;
  selectedAssets?: Asset[];
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

export interface Asset {
  id: number;
  group: string;
  type: string;
  assetId: string;
  name: string;
  warehouse: string;
  status: string;
  stockQuantity?: number;
  destination?: string;
  rentalPeriod?: string;
}

const initialForm: RentalRequestForm = {
  requester: "김관리",
  assetName: "",
  arrivalDate: "",
  destination: "",
  rentalPeriod: "",
  quantity: "",
  memo: "",
};

const getDateAfter = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getPeriodString = (start: Date, days: number) => {
  const yyyy = start.getFullYear();
  const mm = String(start.getMonth() + 1).padStart(2, '0');
  const dd = String(start.getDate()).padStart(2, '0');
  const startStr = `${yyyy}.${mm}.${dd}`;
  const end = new Date(start);
  end.setDate(end.getDate() + days - 1);
  const yyyy2 = end.getFullYear();
  const mm2 = String(end.getMonth() + 1).padStart(2, '0');
  const dd2 = String(end.getDate()).padStart(2, '0');
  const endStr = `${yyyy2}.${mm2}.${dd2}`;
  return `${startStr}~${endStr}`;
};

const RentalRequestModal: React.FC<RentalRequestModalProps> = ({ open, onClose, onSubmit, selectedAssets }) => {
  const [form, setForm] = React.useState<RentalRequestForm>(initialForm);
  const [errors, setErrors] = React.useState<{ [k: string]: string }>({});
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const arrival = getDateAfter(0);
      const startDate = new Date(arrival);
      const rentalPeriod = getPeriodString(startDate, 5);
      if (selectedAssets && selectedAssets.length === 1) {
        const asset = selectedAssets[0];
        const defaultDestination = asset.destination || "";
        const defaultRentalPeriod = asset.rentalPeriod || rentalPeriod;
        if (asset.assetId === 'A4000_40101') {
          setForm({ ...initialForm, assetName: asset.name, arrivalDate: arrival, rentalPeriod: defaultRentalPeriod, destination: defaultDestination, quantity: 4 });
        } else {
          setForm({ ...initialForm, assetName: asset.name, arrivalDate: arrival, rentalPeriod: defaultRentalPeriod, destination: defaultDestination });
        }
      } else {
        setForm({ ...initialForm, arrivalDate: arrival, rentalPeriod });
      }
      setErrors({});
    }
  }, [open, selectedAssets]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    const header = document.querySelector('header');
    if (open) {
      if (header) header.style.display = 'none';
    } else {
      if (header) header.style.display = '';
    }
    return () => {
      if (header) header.style.display = '';
    };
  }, [open]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.requester.trim()) newErrors.requester = "요청인을 입력하세요.";
    if (!form.assetName.trim()) newErrors.assetName = "자산 이름을 입력하세요.";
    if (!form.destination.trim()) newErrors.destination = "도착지를 입력하세요.";
    if (!form.quantity || Number(form.quantity) <= 0) newErrors.quantity = "요청 수량을 입력하세요.";
    if (
      selectedAssets && selectedAssets.length === 1 &&
      typeof selectedAssets[0].stockQuantity === 'number' &&
      typeof form.quantity === 'number' &&
      form.quantity > selectedAssets[0].stockQuantity
    ) {
      newErrors.quantity = "대여 가능 수량을 초과할 수 없습니다.";
    }
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
      router.push('/materials/mock-management-page');
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
        {selectedAssets && selectedAssets.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">선택된 자산</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {selectedAssets.map(a => (
                <li key={a.id}>{a.name} ({a.assetId}) - {a.warehouse}</li>
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
          {(!selectedAssets || selectedAssets.length === 1) && (
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
          )}
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
            <div className="flex items-center gap-2">
              <input
                name="quantity"
                type="number"
                min={1}
                className="border rounded px-4 py-2 w-full"
                value={form.quantity}
                onChange={handleChange}
                placeholder="수량 입력"
              />
              {selectedAssets && selectedAssets.length === 1 && typeof selectedAssets[0].stockQuantity === 'number' ? (
                <span className={
                  typeof form.quantity === 'number' && form.quantity > selectedAssets[0].stockQuantity
                    ? "text-red-500 font-bold"
                    : "text-gray-600"
                }>
                  잔여 수량: {Math.max(selectedAssets[0].stockQuantity - (typeof form.quantity === 'number' ? form.quantity : 0), 0)}개
                </span>
              ) : (
                <span className="text-gray-400">잔여 수량: -</span>
              )}
            </div>
            {typeof form.quantity === 'number' && selectedAssets && selectedAssets.length === 1 &&
              typeof selectedAssets[0].stockQuantity === 'number' &&
              form.quantity > selectedAssets[0].stockQuantity && (
                <div className="text-xs text-red-500 mt-1">대여 가능 수량을 초과할 수 없습니다.</div>
              )
            }
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