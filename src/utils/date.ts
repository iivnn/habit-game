import type { HabitTask, Weekday } from "@/domain/types";

export const DAILY_RESET_HOUR = 2;

export const getLogicalDate = (date: Date) => {
  const next = new Date(date);
  next.setHours(next.getHours() - DAILY_RESET_HOUR, 0, 0, 0);
  return next;
};

export const getStartOfDay = (date: Date) => {
  const logicalDate = getLogicalDate(date);
  return new Date(logicalDate.getFullYear(), logicalDate.getMonth(), logicalDate.getDate(), DAILY_RESET_HOUR, 0, 0, 0);
};

export const getStartOfWeek = (date: Date) => {
  const next = getStartOfDay(date);
  const day = getLogicalDate(date).getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
};

export const formatIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export const isSameIsoDate = (leftIso: string, rightIso: string) => leftIso.slice(0, 10) === rightIso.slice(0, 10);

export const formatTime = (hour: number, minute: number) =>
  `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

export const allWeekdays: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export const weekdayShortLabels: Record<Weekday, string> = {
  0: "D",
  1: "S",
  2: "T",
  3: "Q",
  4: "Q",
  5: "S",
  6: "S"
};

export const isTaskActiveOnDate = (task: HabitTask, date: Date) => {
  if (task.frequency !== "daily") {
    return true;
  }

  const weekdays = task.activeWeekdays?.length ? task.activeWeekdays : allWeekdays;
  return weekdays.includes(date.getDay() as Weekday);
};
