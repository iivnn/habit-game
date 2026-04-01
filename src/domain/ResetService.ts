import type { HabitTask, WorldState } from "@/domain/types";
import { formatIsoDate, getStartOfDay, getStartOfWeek, isSameIsoDate, isTaskActiveOnDate } from "@/utils/date";

const resetTasksByFrequency = (tasks: HabitTask[], frequency: HabitTask["frequency"]) =>
  tasks.map((task) =>
    task.frequency === frequency
      ? { ...task, completed: false, completedAt: undefined }
      : task
  );

export const applyResets = (state: WorldState, now: Date) => {
  let nextState = { ...state };
  const dayStart = getStartOfDay(now).toISOString();
  const weekStart = getStartOfWeek(now).toISOString();

  if (!state.lastDailyResetAt || !isSameIsoDate(state.lastDailyResetAt, dayStart)) {
    nextState = {
      ...nextState,
      tasks: resetTasksByFrequency(nextState.tasks, "daily"),
      lastDailyResetAt: dayStart
    };
  }

  if (!state.lastWeeklyResetAt || !isSameIsoDate(state.lastWeeklyResetAt, weekStart)) {
    nextState = {
      ...nextState,
      tasks: resetTasksByFrequency(nextState.tasks, "weekly"),
      lastWeeklyResetAt: weekStart
    };
  }

  return nextState;
};

export const createEndOfDayReportIfNeeded = (state: WorldState, now: Date) => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const reportDate = formatIsoDate(yesterday);

  if (state.lastReportGeneratedFor === reportDate) {
    return state;
  }

  const dailyTasks = state.tasks.filter(
    (task) => task.frequency === "daily" && task.dailyQuestType !== "optional" && isTaskActiveOnDate(task, yesterday)
  );
  const missedTasks = dailyTasks.filter((task) => !task.completed);
  const completedCount = dailyTasks.length - missedTasks.length;
  const totalCount = dailyTasks.length;
  const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const themedSummary =
    missedTasks.length === 0
      ? "Ao cair da noite, o cronista do reino registrou um dia impecável. Nenhuma quest ficou para trás."
      : `Ao soar o sino da taverna, ${missedTasks.length} quest${
          missedTasks.length > 1 ? "s ficaram" : " ficou"
        } pendente${
          missedTasks.length > 1 ? "s" : ""
        }. O reino espera um novo amanhecer para você recuperar a honra.`;

  return {
    ...state,
    dailyReports: [
      {
        id: `report-${reportDate}`,
        date: reportDate,
        summary: themedSummary,
        missedTaskIds: missedTasks.map((task) => task.id),
        completedCount,
        totalCount,
        completionRate
      },
      ...state.dailyReports.filter((report) => report.date !== reportDate)
    ],
    lastReportGeneratedFor: reportDate
  };
};
