"use client";

import { useState } from "react";

import { Button } from "@nestegg/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nestegg/ui/card";

interface DayData {
  date: Date;
  amount?: number;
  label?: string;
}

interface SpendingCalendarProps {
  data?: Record<string, number | string>; // date string -> amount or label
  onDayClick?: (date: Date) => void;
}

export function SpendingCalendar({
  data = {},
  onDayClick,
}: SpendingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday

  // Get month name
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate array of days
  const days: (DayData | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const value = dateKey ? data[dateKey] : undefined;

    days.push({
      date,
      amount: typeof value === "number" ? value : undefined,
      label: typeof value === "string" ? value : undefined,
    });
  }

  const weekdayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthName} {year}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              ←
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {weekdayHeaders.map((day) => (
            <div
              key={day}
              className="text-muted-foreground flex h-8 items-center justify-center text-xs font-medium"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((dayData, index) => {
            if (!dayData) {
              return <div key={`empty-${index}`} className="h-16" />;
            }

            const { date, amount, label } = dayData;
            const todayClass = isToday(date)
              ? "border-2 border-primary"
              : "border border-border";

            return (
              <button
                key={date.toISOString()}
                onClick={() => onDayClick?.(date)}
                className={`${todayClass} hover:bg-accent flex h-16 flex-col items-start space-y-2 rounded-md p-1 text-xs transition-colors ${
                  onDayClick ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className="text-muted-foreground p-1 font-light">
                  {date.getDate()}
                </span>
                {amount !== undefined && (
                  <span className="text-muted-foreground text-[10px]">
                    ${amount > 0 ? "+" : ""}
                    {amount.toLocaleString()}
                  </span>
                )}
                {label && (
                  <span className="text-muted-foreground w-full truncate text-[10px]">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
