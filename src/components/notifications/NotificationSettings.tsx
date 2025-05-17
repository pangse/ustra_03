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

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    rentalExpire: true,
    rentalOverdue: true,
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/notifications/settings?userId=${userId}`);
      const data = await response.json();
      if (data) {
        setSettings(JSON.parse(data.message));
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">알림 유형</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">대여 만료 알림</label>
            <Switch
              checked={settings.rentalExpire}
              onCheckedChange={() => handleToggle("rentalExpire")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">미반납 알림</label>
            <Switch
              checked={settings.rentalOverdue}
              onCheckedChange={() => handleToggle("rentalOverdue")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">알림 수신 방식</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">문자 메시지</label>
            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={() => handleToggle("smsEnabled")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">이메일</label>
            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={() => handleToggle("emailEnabled")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">푸시 알림</label>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={() => handleToggle("pushEnabled")}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full"
      >
        {saving ? "저장 중..." : "설정 저장"}
      </Button>
    </div>
  );
} 