"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "RENTAL" | "RETURN";
  status: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showRentalDialog, setShowRentalDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [purpose, setPurpose] = useState("");
  const [request, setRequest] = useState("");

  const handleRentalSubmit = async () => {
    try {
      const response = await fetch("/api/rental-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: parseInt(selectedMaterial),
          startDate,
          endDate,
          purpose,
          request,
          arrivalDate: startDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create rental request");
      }

      const newEvent: Event = {
        id: Date.now().toString(),
        title: `대여 요청: ${selectedMaterial}`,
        start: startDate!,
        end: endDate!,
        type: "RENTAL",
        status: "PENDING",
      };

      setEvents([...events, newEvent]);
      setShowRentalDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error creating rental request:", error);
    }
  };

  const handleReturnSubmit = async () => {
    try {
      const response = await fetch("/api/returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: parseInt(selectedMaterial),
          returnDate: startDate,
          returnLocation: "서울 본사",
          status: "NORMAL",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create return");
      }

      const newEvent: Event = {
        id: Date.now().toString(),
        title: `반납 예정: ${selectedMaterial}`,
        start: startDate!,
        end: startDate!,
        type: "RETURN",
        status: "PENDING",
      };

      setEvents([...events, newEvent]);
      setShowReturnDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error creating return:", error);
    }
  };

  const resetForm = () => {
    setSelectedMaterial("");
    setStartDate(new Date());
    setEndDate(new Date());
    setPurpose("");
    setRequest("");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <PageBreadcrumb pageTitle="캘린더" />
        <div className="space-x-2">
          <Dialog open={showRentalDialog} onOpenChange={setShowRentalDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">대여 요청</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>대여 요청</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                >
                  <option value="">자산 선택</option>
                  <option value="1">노트북1</option>
                  <option value="2">노트북2</option>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">시작일</label>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      locale={ko}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">종료일</label>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      locale={ko}
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="대여 목적"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
                <Textarea
                  placeholder="추가 요청사항"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                />
                <Button onClick={handleRentalSubmit}>요청하기</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">반납 등록</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>반납 등록</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                >
                  <option value="">자산 선택</option>
                  <option value="1">노트북1</option>
                  <option value="2">노트북2</option>
                </Select>
                <div>
                  <label className="block text-sm font-medium mb-1">반납일</label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={ko}
                  />
                </div>
                <Button onClick={handleReturnSubmit}>등록하기</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={ko}
          className="rounded-md border"
        />
      </div>
    </div>
  );
} 