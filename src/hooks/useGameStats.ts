import { useMemo } from "react";
import { getXpForNextLevel } from "@/domain/LevelingService";
import { useGame } from "@/providers/GameProvider";
import { isTaskActiveOnDate } from "@/utils/date";

export const useGameStats = () => {
  const { state } = useGame();

  return useMemo(() => {
    const progress = state.player?.progress;

    if (!progress) {
      return null;
    }

    const nextLevelXp = getXpForNextLevel(progress.level);
    const today = new Date();
    const dailyTasks = state.tasks.filter(
      (task) => task.frequency === "daily" && task.dailyQuestType !== "optional" && isTaskActiveOnDate(task, today)
    );
    const weeklyTasks = state.tasks.filter((task) => task.frequency === "weekly");
    const dailyCompletedCount = dailyTasks.filter((task) => task.completed).length;
    const weeklyCompletedCount = weeklyTasks.filter((task) => task.completed).length;
    const completionRate = dailyTasks.length
      ? Math.round((dailyCompletedCount / dailyTasks.length) * 100)
      : 0;

    return {
      ...progress,
      nextLevelXp,
      completionRate,
      dailyCompletedCount,
      dailyTotalCount: dailyTasks.length,
      weeklyCompletedCount,
      weeklyTotalCount: weeklyTasks.length
    };
  }, [state.player, state.tasks]);
};
