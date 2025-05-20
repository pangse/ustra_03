"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  // const [monthlyCounts, setMonthlyCounts] = useState<number[]>(Array(12).fill(0));
  // const [loading, setLoading] = useState(true);
  // const [isOpen, setIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // 최근 3개월(2024년 4월, 5월, 6월) mock data
  const inCounts = [18, 25, 30].map(v => v * 36); // 입고
  const outCounts = [15, 20, 25].map(v => v * 36); // 출고
  const rentCounts = [12, 18, 22].map(v => v * 36); // 대여
  const returnCounts = [11, 16, 20].map(v => v * 36); // 회수
  const disposeCounts = [2, 2, 3].map(v => v * 36); // 폐기
  const lostCounts = [1, 0, 1].map(v => v * 36); // 분실
  const loading = false;

  // useEffect(() => {
  //   async function fetchStats() {
  //     setLoading(true);
  //     try {
  //       const res = await fetch("/api/material-history/stats");
  //       const data = await res.json();
  //       setMonthlyCounts(data.monthlyCounts || Array(12).fill(0));
  //     } catch (e) {
  //       setMonthlyCounts(Array(12).fill(0));
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchStats();
  // }, []);

  const options: ApexOptions = {
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
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["2024-04", "2024-05", "2024-06"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = [
    { name: "입고", data: loading ? Array(12).fill(0) : inCounts },
    { name: "출고", data: loading ? Array(12).fill(0) : outCounts },
    { name: "대여", data: loading ? Array(12).fill(0) : rentCounts },
    { name: "회수", data: loading ? Array(12).fill(0) : returnCounts },
    { name: "폐기", data: loading ? Array(12).fill(0) : disposeCounts },
    { name: "분실", data: loading ? Array(12).fill(0) : lostCounts },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          최근 3개월 입출고 이력
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
