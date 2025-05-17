'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';

interface MaterialWithDetails {
  id: number;
  name: string;
  categoryId: number;
  category: {
    name: string;
  };
  locationId: number;
  location: {
    name: string;
  };
  handlerId: number;
  handler: {
    name: string;
    department: string;
    phone_number: string;
  };
  quantity: number;
  rfid_tag: string;
  status: string;
  assetType?: {
    name: string;
  };
}

interface ValueHelpItem {
  id: string;
  name: string;
}

// 모바일 달력 스타일
const mobileCalendarStyles = `
  .mobile-calendar {
    width: 100% !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    background: white !important;
  }
  .mobile-calendar .react-datepicker__month-container {
    width: 100% !important;
    background: white !important;
    padding: 16px !important;
  }
  .mobile-calendar .react-datepicker__header {
    background: white !important;
    border-bottom: none !important;
    padding: 16px 8px 8px !important;
  }
  .mobile-calendar .react-datepicker__current-month {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #000 !important;
    margin-bottom: 20px !important;
    text-align: center !important;
  }
  .mobile-calendar .react-datepicker__day-name {
    width: 44px !important;
    height: 44px !important;
    line-height: 44px !important;
    margin: 0 !important;
    color: #8e8e93 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    text-align: center !important;
  }
  .mobile-calendar .react-datepicker__day {
    width: 44px !important;
    height: 44px !important;
    line-height: 44px !important;
    margin: 0 !important;
    border-radius: 22px !important;
    font-size: 16px !important;
    color: #000 !important;
    text-align: center !important;
    transition: all 0.2s ease !important;
  }
  .mobile-calendar .react-datepicker__day:hover {
    background: #f2f2f7 !important;
    transform: scale(1.1) !important;
  }
  .mobile-calendar .react-datepicker__day--selected {
    background: #007aff !important;
    color: white !important;
    font-weight: 600 !important;
    transform: scale(1.1) !important;
  }
  .mobile-calendar .react-datepicker__day--keyboard-selected {
    background: #007aff !important;
    color: white !important;
  }
  .mobile-calendar .react-datepicker__day--in-range {
    background: #e5f2ff !important;
    color: #007aff !important;
  }
  .mobile-calendar .react-datepicker__day--in-selecting-range {
    background: #e5f2ff !important;
    color: #007aff !important;
  }
  .mobile-calendar .react-datepicker__day--disabled {
    color: #c7c7cc !important;
  }
  .mobile-calendar .react-datepicker__navigation {
    top: 20px !important;
    width: 36px !important;
    height: 36px !important;
    border-radius: 18px !important;
    background: #f2f2f7 !important;
  }
  .mobile-calendar .react-datepicker__navigation:hover {
    background: #e5e5ea !important;
  }
  .mobile-calendar .react-datepicker__navigation-icon::before {
    border-color: #007aff !important;
    border-width: 2px 2px 0 0 !important;
    width: 8px !important;
    height: 8px !important;
  }
  .mobile-calendar .react-datepicker__year-dropdown {
    background: white !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    padding: 8px !important;
  }
  .mobile-calendar .react-datepicker__year-option {
    padding: 12px 16px !important;
    font-size: 16px !important;
    border-radius: 8px !important;
    margin: 4px 0 !important;
  }
  .mobile-calendar .react-datepicker__year-option:hover {
    background: #f2f2f7 !important;
  }
  .mobile-calendar .react-datepicker__year-option--selected {
    background: #007aff !important;
    color: white !important;
  }
  .mobile-popper {
    width: 100% !important;
    max-width: 100vw !important;
    z-index: 9999 !important;
    padding: 16px !important;
  }
  .react-datepicker__input-container {
    position: relative !important;
  }
  .react-datepicker__input-container input {
    width: 100% !important;
    padding: 16px !important;
    padding-right: 48px !important;
    border: 1px solid #e5e5ea !important;
    border-radius: 12px !important;
    font-size: 16px !important;
    color: #000 !important;
    background: white !important;
    -webkit-appearance: none !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  }
  .react-datepicker__input-container::after {
    content: '' !important;
    position: absolute !important;
    right: 16px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 20px !important;
    height: 20px !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23007aff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E") !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    pointer-events: none !important;
  }
  .react-datepicker__close-icon {
    display: none !important;
  }
  .react-datepicker__day--outside-month {
    color: #c7c7cc !important;
  }
  .react-datepicker__day--today {
    font-weight: 600 !important;
    color: #007aff !important;
  }
  .react-datepicker__day--today.react-datepicker__day--selected {
    color: white !important;
  }
  .react-datepicker__day--keyboard-selected.react-datepicker__day--today {
    color: white !important;
  }
  .react-datepicker__day--keyboard-selected.react-datepicker__day--in-range {
    color: white !important;
  }
  .react-datepicker__day--keyboard-selected.react-datepicker__day--in-selecting-range {
    color: white !important;
  }
  .react-datepicker__day--in-range.react-datepicker__day--selected {
    color: white !important;
  }
  .react-datepicker__day--in-selecting-range.react-datepicker__day--selected {
    color: white !important;
  }
  .react-datepicker__day--in-range.react-datepicker__day--today {
    color: #007aff !important;
  }
  .react-datepicker__day--in-selecting-range.react-datepicker__day--today {
    color: #007aff !important;
  }
  .react-datepicker__day--in-range.react-datepicker__day--selected.react-datepicker__day--today {
    color: white !important;
  }
  .react-datepicker__day--in-selecting-range.react-datepicker__day--selected.react-datepicker__day--today {
    color: white !important;
  }
`;

export default function RentalRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showScanScreen, setShowScanScreen] = useState(true);
  const [material, setMaterial] = useState<MaterialWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [request, setRequest] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Value Help states
  const [showValueHelp, setShowValueHelp] = useState(false);
  const [valueHelpType, setValueHelpType] = useState<'group' | 'type' | 'id' | 'location' | null>(null);
  const [valueHelpItems, setValueHelpItems] = useState<ValueHelpItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(tomorrow);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(tomorrow);

  const handleRandomMaterial = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/materials');
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      const data = await response.json();
      if (data.materials.length === 0) {
        throw new Error('No materials available');
      }
      const randomMaterial = data.materials[Math.floor(Math.random() * data.materials.length)];
      setMaterial(randomMaterial);
      setShowScanScreen(false);
    } catch (err) {
      console.error('Error selecting random material:', err);
      setError('자산을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleValueHelpClick = async (type: 'group' | 'type' | 'id' | 'location') => {
    setValueHelpType(type);
    setShowValueHelp(true);
    setSearchTerm('');
    setValueHelpItems([]); // Reset items before loading

    try {
      let endpoint = '';
      switch (type) {
        case 'group':
          endpoint = '/api/categories';
          break;
        case 'type':
          endpoint = '/api/materials';
          break;
        case 'id':
          endpoint = '/api/materials';
          break;
        case 'location':
          endpoint = '/api/locations';
          break;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch value help items');
      }

      const data = await response.json();
      let items: ValueHelpItem[] = [];

      switch (type) {
        case 'group':
          if (data.categories && Array.isArray(data.categories)) {
            items = data.categories.map((cat: any) => ({ id: cat.id, name: cat.name }));
          }
          break;
        case 'type':
          if (data.materials && Array.isArray(data.materials)) {
            items = data.materials.map((mat: any) => ({ id: mat.id, name: mat.name }));
          }
          break;
        case 'id':
          if (data.materials && Array.isArray(data.materials)) {
            items = data.materials.map((mat: any) => ({ id: mat.id, name: mat.rfid_tag }));
          }
          break;
        case 'location':
          if (data.locations && Array.isArray(data.locations)) {
            items = data.locations.map((loc: any) => ({ id: loc.id, name: loc.name }));
          }
          break;
      }

      if (items.length === 0) {
        setError('데이터가 없습니다.');
        setShowValueHelp(false);
        return;
      }

      setValueHelpItems(items);
    } catch (err) {
      console.error('Error fetching value help items:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      setShowValueHelp(false);
    }
  };

  const handleValueHelpSelect = async (item: ValueHelpItem) => {
    if (valueHelpType === 'type' || valueHelpType === 'id') {
      try {
        const response = await fetch(`/api/materials/${item.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch material details');
        }
        const materialData = await response.json();
        setMaterial(materialData);
      } catch (err) {
        console.error('Error fetching material details:', err);
        setError('자산 정보를 불러오는데 실패했습니다.');
      }
    }
    setShowValueHelp(false);
  };

  const filteredValueHelpItems = valueHelpItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!material || !startDate || !endDate || !purpose) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (endDate <= startDate) {
        setError('종료일은 시작일보다 이후여야 합니다.');
        return;
      }

      const response = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId: material.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          purpose: purpose.trim(),
          request: request.trim() || undefined,
          arrivalDate: arrivalDate?.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || '대여 신청에 실패했습니다.');
      }

      setSuccess('대여 신청이 완료되었습니다.');
      setShowConfirmModal(false);
      
      // 대여 내역 페이지로 이동
      setTimeout(() => {
        router.push('/rental/my-requests');
      }, 100);
    } catch (err) {
      console.error('Error submitting rental request:', err);
      setError(err instanceof Error ? err.message : '대여 신청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (showScanScreen) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 w-full">
          <h1 className="text-xl font-bold mb-2">• 대여 요청 &gt; 대여 예약</h1>
          <p className="text-sm text-gray-500 text-right mb-6">의상A팀 이하니</p>
          
          <div 
            className="flex justify-center cursor-pointer hover:opacity-80 transition-opacity py-8"
            onClick={handleRandomMaterial}
          >
            <Image
              key="rfid-scan-image"
              src="/images/etc/rfid_01.png"
              alt="RFID Scan"
              width={200}
              height={200}
              className="rounded-lg"             
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => setShowScanScreen(true)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  if (!material) return null;

  return (
    <>
      <style>{mobileCalendarStyles}</style>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-xl font-bold mb-2">• 대여 요청 &gt; 대여 예약</h1>
          <p className="text-sm text-gray-500 text-right mb-6">의상A팀 이하니</p>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                대여 가능
              </span>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                {material.quantity}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center border rounded-lg p-3">
                <span className="text-gray-600 w-24">자산 그룹</span>
                <span className="flex-1">{material.category.name}</span>
                <button
                  onClick={() => handleValueHelpClick('group')}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center border rounded-lg p-3">
                <span className="text-gray-600 w-24">자산 유형</span>
                <span className="flex-1">{material.name}</span>
                <button
                  onClick={() => handleValueHelpClick('type')}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center border rounded-lg p-3">
                <span className="text-gray-600 w-24">자산 ID</span>
                <span className="flex-1">{material.rfid_tag}</span>
                <button
                  onClick={() => handleValueHelpClick('id')}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center border rounded-lg p-3">
                <span className="text-gray-600 w-24">자산 위치</span>
                <span className="flex-1">{material.location.name}</span>
                <button
                  onClick={() => handleValueHelpClick('location')}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center border rounded-lg p-3">
                <span className="text-gray-600 w-24">대여 수량</span>
                <div className="flex-1 flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 px-3 py-1 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-y"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 px-3 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirmModal(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사용 목적
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  className="w-full p-2 border rounded-lg"
                  placeholder="사용 목적을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  추가 요청사항
                </label>
                <textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  placeholder="추가 요청사항을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사용 기간
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date()}
                      locale={ko}
                      dateFormat="yyyy년 MM월 dd일"
                      className="w-full p-2 border rounded-lg"
                      placeholderText="시작일 선택"
                      required
                      showPopperArrow={false}
                      calendarClassName="mobile-calendar"
                      popperClassName="mobile-popper"
                      popperPlacement="bottom-start"
                      isClearable={false}
                      showYearDropdown={true}
                      scrollableYearDropdown={true}
                      yearDropdownItemNumber={10}
                      todayButton="오늘"
                      showMonthDropdown={true}
                      scrollableMonthYearDropdown={true}
                    />
                  </div>
                  <div>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || undefined}
                      locale={ko}
                      dateFormat="yyyy년 MM월 dd일"
                      className="w-full p-2 border rounded-lg"
                      placeholderText="종료일 선택"
                      required
                      showPopperArrow={false}
                      calendarClassName="mobile-calendar"
                      popperClassName="mobile-popper"
                      popperPlacement="bottom-start"
                      isClearable={false}
                      showYearDropdown={true}
                      scrollableYearDropdown={true}
                      yearDropdownItemNumber={10}
                      todayButton="오늘"
                      showMonthDropdown={true}
                      scrollableMonthYearDropdown={true}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  희망 도착일
                </label>
                <DatePicker
                  selected={arrivalDate}
                  onChange={(date) => setArrivalDate(date)}
                  minDate={new Date()}
                  maxDate={startDate || undefined}
                  locale={ko}
                  dateFormat="yyyy년 MM월 dd일"
                  className="w-full p-2 border rounded-lg"
                  placeholderText="희망 도착일 선택"
                  required
                  showPopperArrow={false}
                  calendarClassName="mobile-calendar"
                  popperClassName="mobile-popper"
                  popperPlacement="bottom-start"
                  isClearable={false}
                  showYearDropdown={true}
                  scrollableYearDropdown={true}
                  yearDropdownItemNumber={10}
                  todayButton="오늘"
                  showMonthDropdown={true}
                  scrollableMonthYearDropdown={true}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !material || !startDate || !endDate || !purpose || !arrivalDate}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? '처리 중...' : '대여 예약'}
              </button>
            </form>
          </div>
        </div>

        {/* Value Help Modal */}
        {showValueHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {valueHelpType === 'group' && '자산 그룹 선택'}
                  {valueHelpType === 'type' && '자산 유형 선택'}
                  {valueHelpType === 'id' && '자산 ID 선택'}
                  {valueHelpType === 'location' && '자산 위치 선택'}
                </h3>
              </div>
              <div className="p-4 border-b">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {filteredValueHelpItems.length === 0 ? (
                  <p className="text-gray-500 text-center">검색 결과가 없습니다.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredValueHelpItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleValueHelpSelect(item)}
                        className="w-full text-left p-2 hover:bg-gray-100 rounded-lg"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={() => setShowValueHelp(false)}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
              <h3 className="text-xl font-bold">대여 예약 확인</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">자산 그룹</span>
                  <span className="font-medium">{material?.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">자산 유형</span>
                  <span className="font-medium">{material?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">대여 수량</span>
                  <span className="font-medium">{quantity}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">사용 기간</span>
                  <span className="font-medium">
                    {startDate?.toLocaleDateString('ko-KR')} ~ {endDate?.toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">희망 도착일</span>
                  <span className="font-medium">{arrivalDate?.toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">사용 목적</span>
                  <span className="font-medium text-right">{purpose}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                  {loading ? '처리 중...' : '확인'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 