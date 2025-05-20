"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
  rentalExpire: boolean;
  rentalOverdue: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

interface NotificationSettingsProps {
  userId: number;
}

const NOTIFICATION_ITEMS = [
  {
    key: "rentalApproved",
    label: "대여 요청 완료",
    desc: "대여 요청이 승인되었을 때 알림을 받습니다.",
    defaultReceive: true,
    defaultMethods: { system: true, email: true, sms: false },
  },
  {
    key: "returnCompleted",
    label: "반납 완료",
    desc: "자산 반납이 완료되었을 때 알림을 받습니다.",
    defaultReceive: true,
    defaultMethods: { system: true, email: false, sms: false },
  },
  {
    key: "overdue",
    label: "기한 초과",
    desc: "대여 기한을 넘겼을 때 알림을 받습니다.",
    defaultReceive: true,
    defaultMethods: { system: true, email: false, sms: true },
  },
  {
    key: "rejected",
    label: "반려됨",
    desc: "대여 요청이 반려되었을 때 알림을 받습니다.",
    defaultReceive: true,
    defaultMethods: { system: true, email: true, sms: false },
  },
  {
    key: "notice",
    label: "공지사항",
    desc: "새로운 공지사항이 있을 때 알림을 받습니다.",
    defaultReceive: true,
    defaultMethods: { system: true, email: false, sms: false },
  },
];

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [settings, setSettings] = useState(
    NOTIFICATION_ITEMS.map(item => ({
      key: item.key,
      receive: item.defaultReceive,
      methods: { ...item.defaultMethods },
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState({
    type: "",
    method: "",
    receive: "",
    search: "",
  });

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/notifications/settings?userId=${userId}`);
      const data = await response.json();
      let arr;
      if (data && Array.isArray(data.message)) {
        arr = data.message;
      } else if (data && typeof data.message === "string") {
        try {
          const parsed = JSON.parse(data.message);
          arr = Array.isArray(parsed) ? parsed : null;
        } catch {
          arr = null;
        }
      }
      setSettings(
        arr && Array.isArray(arr) && arr.length === NOTIFICATION_ITEMS.length
          ? arr
          : NOTIFICATION_ITEMS.map(item => ({
              key: item.key,
              receive: item.defaultReceive,
              methods: { ...item.defaultMethods },
            }))
      );
    } catch (error) {
      setSettings(
        NOTIFICATION_ITEMS.map(item => ({
          key: item.key,
          receive: item.defaultReceive,
          methods: { ...item.defaultMethods },
        }))
      );
      console.error("Error fetching notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = (idx: number) => {
    setSettings(prev => prev.map((s, i) => i === idx ? { ...s, receive: !s.receive } : s));
  };
  const handleMethod = (idx: number, method: string) => {
    setSettings(prev => prev.map((s, i) =>
      i === idx ? { ...s, methods: { ...s.methods, [method]: !s.methods[method] } } : s
    ));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/notifications/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          settings,
        }),
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-2 pb-24">
      <h2 className="text-xl font-bold mb-4">알림 설정</h2>
      {/* Filters */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="grid grid-cols-6 gap-4 items-center">
          <label className="col-span-1 text-sm">알림 유형</label>
          <select className="col-span-2 border rounded px-2 py-1" name="type" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
            <option value="">전체</option>
            {NOTIFICATION_ITEMS.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
          <label className="col-span-1 text-sm">전송 방식</label>
          <select className="col-span-2 border rounded px-2 py-1" name="method" value={filter.method} onChange={e => setFilter(f => ({ ...f, method: e.target.value }))}>
            <option value="">전체</option>
            <option value="system">시스템</option>
            <option value="email">이메일</option>
            <option value="sms">문자</option>
          </select>
          <label className="col-span-1 text-sm">수신 여부</label>
          <select className="col-span-2 border rounded px-2 py-1" name="receive" value={filter.receive} onChange={e => setFilter(f => ({ ...f, receive: e.target.value }))}>
            <option value="">전체</option>
            <option value="true">ON</option>
            <option value="false">OFF</option>
          </select>
          <label className="col-span-1 text-sm">검색어</label>
          <input className="col-span-2 border rounded px-2 py-1" name="search" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} placeholder="검색어 입력" />
        </div>
        <div className="mt-4 flex justify-end">
          <button type="button" className="bg-black text-white px-3 py-1 rounded">조회</button>
        </div>
      </div>
      <div className="overflow-x-auto max-w-4xl mx-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-center">알림 유형</th>
              <th className="border px-2 py-2 text-center">설명</th>
              <th className="border px-2 py-2 text-center">수신 여부</th>
              <th className="border px-2 py-2 text-center">전송 방식</th>
            </tr>
          </thead>
          <tbody>
            {NOTIFICATION_ITEMS.map((item, idx) => {
              const row = settings[idx] || {
                key: item.key,
                receive: item.defaultReceive,
                methods: { ...item.defaultMethods },
              };
              // 필터링
              if (
                (filter.type && item.key !== filter.type) ||
                (filter.method && !row.methods[filter.method]) ||
                (filter.receive && String(row.receive) !== filter.receive) ||
                (filter.search && !item.label.includes(filter.search) && !item.desc.includes(filter.search))
              ) {
                return null;
              }
              return (
                <tr key={item.key} className="align-top">
                  <td className="border px-2 py-2 text-center whitespace-nowrap">{item.label}</td>
                  <td className="border px-2 py-2 text-left">{item.desc}</td>
                  <td className="border px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={row.receive}
                      onChange={() => handleSwitch(idx)}
                      className="accent-blue-500 w-5 h-5"
                    />
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <label className="inline-flex items-center mr-2">
                      <input
                        type="checkbox"
                        checked={row.methods.system}
                        onChange={() => handleMethod(idx, "system")}
                        className="accent-blue-500"
                        disabled={!row.receive}
                      />
                      <span className="ml-1">시스템</span>
                    </label>
                    <label className="inline-flex items-center mr-2">
                      <input
                        type="checkbox"
                        checked={row.methods.email}
                        onChange={() => handleMethod(idx, "email")}
                        className="accent-blue-500"
                        disabled={!row.receive}
                      />
                      <span className="ml-1">이메일</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={row.methods.sms}
                        onChange={() => handleMethod(idx, "sms")}
                        className="accent-blue-500"
                        disabled={!row.receive}
                      />
                      <span className="ml-1">문자</span>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-blue-600 transition-colors"
          >
            {saving ? "저장 중..." : "설정 저장"}
          </button>
        </div>
      </div>
    </div>
  );
} 