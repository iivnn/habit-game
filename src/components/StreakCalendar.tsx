import { Text, View } from "react-native";
import type { DailyReport, HabitTask } from "@/domain/types";
import { theme } from "@/theme";
import { formatIsoDate, isTaskActiveOnDate } from "@/utils/date";

const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];

const getLevel = (rate: number) => {
  if (rate >= 100) return { emoji: "🔥", color: "#ffcf6b", glow: "#6a3f17" };
  if (rate >= 75) return { emoji: "🔥", color: "#ff9d4d", glow: "#5a2b16" };
  if (rate >= 40) return { emoji: "✦", color: "#d97c3f", glow: "#4e2520" };
  if (rate > 0) return { emoji: "•", color: "#8a5d47", glow: "#332126" };
  return { emoji: "•", color: "#48556a", glow: "#1e2836" };
};

const buildSevenDays = (reports: DailyReport[], tasks: HabitTask[]) => {
  const today = new Date();
  const todayIso = formatIsoDate(today);
  const dailyTasks = tasks.filter(
    (task) => task.frequency === "daily" && task.dailyQuestType !== "optional" && isTaskActiveOnDate(task, today)
  );
  const todayCompletedCount = dailyTasks.filter((task) => task.completed).length;
  const todayTotalCount = dailyTasks.length;
  const todayRate = todayTotalCount ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const iso = formatIsoDate(date);
    const report =
      iso === todayIso
        ? {
            date: iso,
            completedCount: todayCompletedCount,
            totalCount: todayTotalCount,
            completionRate: todayRate
          }
        : reports.find((entry) => entry.date === iso);

    return {
      iso,
      label: dayLabels[date.getDay()],
      completedCount: report?.completedCount ?? 0,
      totalCount: report?.totalCount ?? 0,
      completionRate: report?.completionRate ?? 0,
      isToday: iso === todayIso
    };
  });
};

export const StreakCalendar = ({ reports, tasks }: { reports: DailyReport[]; tasks: HabitTask[] }) => {
  const days = buildSevenDays(reports, tasks);

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Calendario de brasas</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
        {days.map((day) => {
          const level = getLevel(day.completionRate);
          return (
            <View key={day.iso} style={{ alignItems: "center", flex: 1, gap: 6 }}>
              <Text style={{ color: day.isToday ? theme.colors.text : theme.colors.muted, fontSize: 11, fontWeight: "800" }}>
                {day.label}
              </Text>
              <View
                style={{
                  width: 36,
                  height: 48,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: level.glow,
                  borderWidth: day.isToday ? 2 : 1,
                  borderColor: day.isToday ? theme.colors.border : "#31455f"
                }}
              >
                <Text style={{ color: level.color, fontSize: 18 }}>{level.emoji}</Text>
              </View>
              <Text style={{ color: level.color, fontSize: 10, fontWeight: "900" }}>
                {day.completedCount}/{day.totalCount}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
        Quanto mais tarefas diarias concluidas, mais forte fica a chama de cada dia.
      </Text>
    </View>
  );
};
