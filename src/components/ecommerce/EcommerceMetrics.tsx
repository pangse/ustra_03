"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [materialCount, setMaterialCount] = useState<number | null>(null);
  const [historyCount, setHistoryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
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
          <Badge color="success">
            <ArrowUpIcon />
            {/* 예시: 증가율 등 */}
          </Badge>
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
          <Badge color="info">
            {/* 예시: 변화율 등 */}
          </Badge>
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
              {loading ? '...' : historyCount ?? '-'}
            </h4>
          </div>
          <Badge color="warning">
            {/* 예시: 변화율 등 */}
          </Badge>
        </div>
      </div>
    </div>
  );
};
