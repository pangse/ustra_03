import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

// 이번 달 대여 회수율 카드 (서버 컴포넌트)
async function MonthlyReturnRateCard() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/api/material-history/monthly-return-rate`,
    { cache: 'no-store' }
  );
  let data = null;
  if (res.ok) data = await res.json();
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm mb-4">
      <div className="text-sm text-gray-500 mb-1">이번 달 대여 회수율</div>
      {data ? (
        <div>
          <span className="text-2xl font-bold text-blue-600">{data.returnRate}%</span>
          <span className="ml-2 text-xs text-gray-400">(대여 {data.rentCount}건, 회수 {data.returnCount}건)</span>
        </div>
      ) : (
        <span className="text-gray-400">데이터 없음</span>
      )}
    </div>
  );
}

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
        <MonthlyReturnRateCard />
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
