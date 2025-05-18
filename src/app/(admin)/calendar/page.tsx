"use client";

import Calendar from "@/components/calendar/Calendar";

export default function CalendarPage() {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-white">
      <div className="w-full max-w-5xl">
        <Calendar />
      </div>
    </div>
  );
} 