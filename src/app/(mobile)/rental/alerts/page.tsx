"use client";
import React from "react";
import NotificationList from "./NotificationList";
import { useRouter } from "next/navigation";

const mockNotifications = [
  {
    id: "1",
    title: "대여 기한이 지났습니다.",
    assetId: "C1000_10143",
    assetName: "블랙 레더 자켓",
    timeAgo: "2시간 전",
    read: false,
  },
  {
    id: "2",
    title: "반납이 완료되었습니다.",
    assetId: "C1000_10144",
    assetName: "화이트 스니커즈",
    timeAgo: "10일 전",
    read: true,
  },
  {
    id: "3",
    title: "대여 승인 대기 중입니다.",
    assetId: "C1000_10145",
    assetName: "레드 백팩",
    timeAgo: "5분 전",
    read: false,
  },
  {
    id: "4",
    title: "자산 점검이 필요합니다.",
    assetId: "C1000_10146",
    assetName: "블루 노트북",
    timeAgo: "1일 전",
    read: false,
  },
  {
    id: "5",
    title: "대여 요청이 반려되었습니다.",
    assetId: "C1000_10147",
    assetName: "그린 파카",
    timeAgo: "3일 전",
    read: true,
  },
  {
    id: "6",
    title: "자산 반납 예정일이 다가옵니다.",
    assetId: "C1000_10148",
    assetName: "실버 태블릿",
    timeAgo: "12시간 전",
    read: false,
  },
  // {
  //   id: "7",
  //   title: "자산 반납 예정일이 다가옵니다.",
  //   assetId: "C1000_10148",
  //   assetName: "실버 태블릿",
  //   timeAgo: "12시간 전",
  //   read: false,
  // },
  // {
  //   id: "8",
  //   title: "대여 연장 신청이 승인되었습니다.",
  //   assetId: "C1000_10149",
  //   assetName: "옐로우 우산",
  //   timeAgo: "4일 전",
  //   read: true,
  // },
  // {
  //   id: "9",
  //   title: "긴급 점검 요청이 등록되었습니다.",
  //   assetId: "C1000_10150",
  //   assetName: "오렌지 카메라",
  //   timeAgo: "30분 전",
  //   read: false,
  // },
  // {
  //   id: "10",
  //   title: "시스템 점검 안내",
  //   assetId: "-",
  //   assetName: "-",
  //   timeAgo: "1주 전",
  //   read: true,
  // },
];

export default function AlertsPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
        {/* 상단 타이틀/뒤로가기 */}
        <div className="flex items-center mb-6">
          <button
            className="mr-2 text-xl"
            onClick={() => router.back()}
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="flex-1 text-center text-lg font-bold">알림센터</h1>
        </div>
        {/* 알림 리스트 */}
        <NotificationList
          notifications={mockNotifications}
          onItemClick={(id) => router.push(`/rental/alerts/${id}`)}
        />
      </div>
    </div>
  );
} 