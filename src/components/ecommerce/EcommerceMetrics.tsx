"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [materialCount, setMaterialCount] = useState<number | null>(null);
  const [historyCount, setHistoryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 금일 대여/반납 mock data
  const todayRentCount = 12;
  const todayReturnCount = 9;

  // 금월 대여/반납/폐기 mock data
  const thisMonthRentCount = 48; // 예시
  const thisMonthReturnCount = 41; // 예시
  const thisMonthDisposeCount = 3; // 예시

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      try {
        const [usersRes, materialsRes, historiesRes] = await Promise.all([
          fetch("/api/users/count"),
          fetch("/api/materials/count"),
          fetch("/api/material-history/count"),
        ]);
        const users = await usersRes.json();
        const materials = await materialsRes.json();
        const histories = await historiesRes.json();
        setUserCount(users.count);
        setMaterialCount(materials.count);
        setHistoryCount(histories.count);
      } catch (e) {
        setUserCount(null);
        setMaterialCount(null);
        setHistoryCount(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* Users Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">회원 수</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? '...' : userCount ?? '-'}
            </h4>
          </div>
          <Badge color="success"> </Badge>
        </div>
      </div>
      {/* Materials Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">자산 수</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? '...' : materialCount ?? '-'}
            </h4>
          </div>
          <Badge color="info"> </Badge>
        </div>
      </div>
      {/* Material History Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ArrowUpIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">입출고 이력 수</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              259 건 {/* {loading ? '...' : historyCount ?? '-'} */}
            </h4>
          </div>
          <Badge color="warning"> </Badge>
        </div>
      </div>
      {/* Today Rent Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
          {/* 대여 아이콘 (예시: ArrowUpIcon) */}
          <ArrowUpIcon className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">오늘 대여</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {todayRentCount} 건
            </h4>
          </div>
          <Badge color="success"> </Badge>
        </div>
      </div>
      {/* Today Return Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/30">
          {/* 반납 아이콘 (예시: ArrowDownIcon) */}
          <ArrowDownIcon className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">오늘 반납</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {todayReturnCount} 건
            </h4>
          </div>
          <Badge color="info"> </Badge>
        </div>
      </div>
      {/* This Month Rent Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
          <ArrowUpIcon className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">5월 대여</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {thisMonthRentCount} 건
            </h4>
          </div>
          <Badge color="success"> </Badge>
        </div>
      </div>
      {/* This Month Return Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/30">
          <ArrowDownIcon className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">5월 반납</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {thisMonthReturnCount} 건
            </h4>
          </div>
          <Badge color="info"> </Badge>
        </div>
      </div>
      {/* This Month Dispose Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-900/30">
          <BoxIconLine className="text-red-600 dark:text-red-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">5월 폐기</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {thisMonthDisposeCount} 건
            </h4>
          </div>
          <Badge color="error"> </Badge>
        </div>
      </div>
    </div>
  );
};
