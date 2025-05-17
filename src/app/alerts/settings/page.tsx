"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 임시 mock 설정 데이터 (실제로는 prisma에서 가져올 예정)
const initialSettings = {
  smsEnabled: true,
  emailEnabled: true,
  pushEnabled: false,
  rentalExpireNotification: true,
  rentalOverdueNotification: true,
  systemNotification: true,
};

export default function AlertSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    // TODO: API 호출하여 설정 저장
    console.log("설정 저장:", settings);
    router.push("/alerts");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">알림 설정</h1>
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {/* 알림 수신 방식 설정 */}
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              알림 수신 방식
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    문자 메시지
                  </label>
                  <p className="text-sm text-gray-500">
                    중요 알림을 문자 메시지로 받습니다
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("smsEnabled")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.smsEnabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.smsEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    이메일
                  </label>
                  <p className="text-sm text-gray-500">
                    상세 알림을 이메일로 받습니다
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailEnabled")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.emailEnabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.emailEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    푸시 알림
                  </label>
                  <p className="text-sm text-gray-500">
                    앱 내 푸시 알림을 받습니다
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("pushEnabled")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.pushEnabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.pushEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 알림 유형 설정 */}
          <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              알림 유형
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    대여 만료 알림
                  </label>
                  <p className="text-sm text-gray-500">
                    대여 만료 5일 전 알림을 받습니다
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("rentalExpireNotification")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.rentalExpireNotification
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.rentalExpireNotification
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    미반납 알림
                  </label>
                  <p className="text-sm text-gray-500">
                    반납 미이행 시 알림을 받습니다
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("rentalOverdueNotification")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.rentalOverdueNotification
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.rentalOverdueNotification
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    시스템 알림
                  </label>
                  <p className="text-sm text-gray-500">
                    시스템 점검, 공지사항 등을 받습니다
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("systemNotification")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.systemNotification ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.systemNotification ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              onClick={handleSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              설정 저장
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 