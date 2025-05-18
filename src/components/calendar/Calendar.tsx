"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  DayCellContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    // 자산 일정 mock data
    const today = new Date();
    const addDays = (date: Date, days: number) => {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    };
    setEvents([
      {
        id: "1",
        title: "자산 입고 (카메라 10대)",
        start: addDays(today, 0),
        extendedProps: { calendar: "Success" },
      },
      {
        id: "2",
        title: "자산 출고 (조명 5세트)",
        start: addDays(today, 1),
        extendedProps: { calendar: "Primary" },
      },
      {
        id: "3",
        title: "자산 대여 (마이크 20개)",
        start: addDays(today, 2),
        end: addDays(today, 4),
        extendedProps: { calendar: "Warning" },
      },
      {
        id: "4",
        title: "자산 대여회수 (마이크 20개)",
        start: addDays(today, 5),
        extendedProps: { calendar: "Success" },
      },
      {
        id: "5",
        title: "자산 폐기 (노후 카메라 2대)",
        start: addDays(today, 7),
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "6",
        title: "콘서트 일정 (서울 올림픽공원)",
        start: addDays(today, 10),
        end: addDays(today, 12),
        extendedProps: { calendar: "Primary" },
      },
      {
        id: "7",
        title: "자산 입고 (스피커 15대)",
        start: addDays(today, 13),
        extendedProps: { calendar: "Success" },
      },
      {
        id: "8",
        title: "자산 대여 (조명 10세트)",
        start: addDays(today, 15),
        end: addDays(today, 17),
        extendedProps: { calendar: "Warning" },
      },
      {
        id: "9",
        title: "자산 대여회수 (조명 10세트)",
        start: addDays(today, 18),
        extendedProps: { calendar: "Success" },
      },
      {
        id: "10",
        title: "자산 출고 (믹서 2대)",
        start: addDays(today, 20),
        extendedProps: { calendar: "Primary" },
      },
      {
        id: "11",
        title: "자산 폐기 (노후 스피커 1대)",
        start: addDays(today, 22),
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "12",
        title: "콘서트 일정 (부산 벡스코)",
        start: addDays(today, 25),
        end: addDays(today, 27),
        extendedProps: { calendar: "Primary" },
      },
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  // 일정 유형별 라벨 매핑
  const typeLabels: Record<string, string> = {
    Success: "입고",
    Primary: "출고/콘서트",
    Warning: "대여",
    Danger: "폐기",
  };
  // 대여회수는 Success(입고)와 구분 위해 title에 '대여회수' 포함 여부로 처리

  // 날짜별 일정 카운트 반환
  const getCountsByDate = (dateStr: string) => {
    const counts: Record<string, number> = {
      입고: 0,
      "출고/콘서트": 0,
      대여: 0,
      대여회수: 0,
      폐기: 0,
    };
    events.forEach((event) => {
      // 날짜 범위 내에 포함되는 이벤트도 카운트
      const start = event.start as string;
      const end = (event.end as string) || start;
      if (dateStr >= start && dateStr <= end) {
        if (event.extendedProps.calendar === "Success") {
          if ((event.title ?? '').includes("대여회수")) {
            counts["대여회수"]++;
          } else {
            counts["입고"]++;
          }
        } else if (event.extendedProps.calendar === "Primary") {
          // 콘서트도 Primary
          counts["출고/콘서트"]++;
        } else if (event.extendedProps.calendar === "Warning") {
          counts["대여"]++;
        } else if (event.extendedProps.calendar === "Danger") {
          counts["폐기"]++;
        }
      }
    });
    return counts;
  };

  // 날짜 셀에 일정 수치 표시
  const renderDayCellContent = (arg: DayCellContentArg) => {
    const dateStr = arg.date.toISOString().split("T")[0];
    const counts = getCountsByDate(dateStr);
    return (
      <div>
        <div className="text-xs font-semibold text-gray-700 mb-1">{arg.dayNumberText}</div>
        <div className="flex flex-col gap-0.5">
          {Object.entries(counts).map(
            ([label, count]) =>
              count > 0 && (
                <span key={label} className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-gray-100 mb-0.5" style={{color: label === '입고' ? '#22c55e' : label === '출고/콘서트' ? '#3b82f6' : label === '대여' ? '#eab308' : label === '대여회수' ? '#4ade80' : label === '폐기' ? '#ef4444' : undefined}}>
                  {label} <b className="ml-1">{count}</b>
                </span>
              )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">자산 일정 캘린더</h2>
        <p className="text-gray-500 mb-3">입고, 출고, 대여, 대여회수, 폐기, 콘서트 등 자산 관련 주요 일정을 한눈에 확인하세요.</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>입고</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>출고/콘서트</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>대여</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-400"></span>대여회수</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>폐기</span>
        </div>
      </div>
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          dayCellContent={renderDayCellContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openModal,
            },
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "일정 수정" : "일정 추가"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              주요 자산 일정을 등록하거나 수정할 수 있습니다.
            </p>
          </div>
          <div className="mt-8">
            <div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Title
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div
                      className={`form-check form-check-${value} form-check-inline`}
                    >
                      <label
                        className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        htmlFor={`modal${key}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            value={key}
                            id={`modal${key}`}
                            checked={eventLevel === key}
                            onChange={() => setEventLevel(key)}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${
                                eventLevel === key ? "block" : "hidden"
                              }`}  
                            ></span>
                          </span>
                        </span>
                        {key}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter Start Date
              </label>
              <div className="relative">
                <input
                  id="event-start-date"
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter End Date
              </label>
              <div className="relative">
                <input
                  id="event-end-date"
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              닫기
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? "변경 저장" : "일정 추가"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
