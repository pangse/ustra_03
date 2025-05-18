"use client";
import React from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";

// 월별 입출고/대여/회수/폐기/분실 mock data (한글)
const inData = [10, 15, 20, 18, 25, 30, 28, 22, 19, 24, 27, 21]; // 입고
const outData = [8, 12, 18, 15, 20, 25, 23, 18, 15, 20, 22, 17]; // 출고
const rentData = [6, 10, 14, 12, 18, 22, 20, 15, 13, 17, 19, 14]; // 대여
const returnData = [5, 9, 13, 11, 16, 20, 18, 13, 11, 15, 17, 12]; // 회수
const disposeData = [1, 2, 1, 2, 2, 3, 2, 1, 2, 2, 3, 2]; // 폐기
const lostData = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 분실

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: [
      "#3b82f6", // 입고 - 파랑
      "#f59e42", // 출고 - 주황
      "#22c55e", // 대여 - 초록
      "#a855f7", // 회수 - 보라
      "#ef4444", // 폐기 - 빨강
      "#6b7280", // 분실 - 회색
    ],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories: [
        "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
      title: { text: "", style: { fontSize: "0px" } },
    },
  };

  const series = [
    { name: "입고", data: inData },
    { name: "출고", data: outData },
    { name: "대여", data: rentData },
    { name: "회수", data: returnData },
    { name: "폐기", data: disposeData },
    { name: "분실", data: lostData },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            월별 입출고 통계
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            월별 입고/출고 현황
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
