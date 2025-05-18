"use client";
import dynamic from "next/dynamic";

const HouseMap = dynamic(() => import("@/components/ecommerce/HouseMap"), {
  ssr: false,
});

export default function HouseMapCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <HouseMap />
    </div>
  );
} 