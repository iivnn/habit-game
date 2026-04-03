import { applyProgressReward, removeProgressReward } from "@/domain/LevelingService";
import { RewardEngine } from "@/domain/tasks/RewardEngine";
import { getShopItem } from "@/domain/shop/catalog";
import type { CharacterClassId, HabitTask, ShopItemId, WorldState } from "@/domain/types";

const rewardEngine = RewardEngine.default();

export const createInitialState = (): WorldState => ({
  tasks: [],
  dailyReports: [],
  activityHistory: [],
  shopUnlocks: {
    purchasedItemIds: [],
    equippedCompanionId: undefined
  },
  preferences: {
    hasSeenOnboarding: false
  }
});

export const createPlayer = (name: string, classId: CharacterClassId): WorldState["player"] => ({
  name,
  classId,
  progress: {
    level: 1,
    xp: 0,
    gold: 0
  }
});

export const createTask = (task: Omit<HabitTask, "id" | "completed" | "createdAt">): HabitTask => ({
  ...task,
  id: `task-${Date.now()}-${Math.round(Math.random() * 10000)}`,
  completed: false,
  createdAt: new Date().toISOString()
});

export const updateTask = (
  state: WorldState,
  taskId: string,
  changes: Partial<Omit<HabitTask, "id" | "createdAt">>
): WorldState => {
  const task = state.tasks.find((entry) => entry.id === taskId);

  if (!task) {
    return state;
  }

  const nextTask = {
    ...task,
    ...changes,
    reward: {
      ...task.reward,
      ...changes.reward
    }
  };

  const oldReward = rewardEngine.resolve(task);
  const nextReward = rewardEngine.resolve(nextTask);
  const nextPlayer =
    state.player && task.completed
      ? {
          ...state.player,
          progress: applyProgressReward(
            removeProgressReward(state.player.progress, oldReward.xp, oldReward.gold),
            nextReward.xp,
            nextReward.gold
          )
        }
      : state.player;

  return {
    ...state,
    player: nextPlayer,
    tasks: state.tasks.map((entry) => (entry.id === taskId ? nextTask : entry)),
    activityHistory: state.activityHistory.map((entry) =>
      entry.taskId === taskId
        ? {
            ...entry,
            taskTitle: nextTask.title,
            taskIcon: nextTask.icon,
            frequency: nextTask.frequency,
            dailyQuestType: nextTask.dailyQuestType,
            reward: nextTask.reward
          }
        : entry
    )
  };
};

export const toggleTaskCompletion = (state: WorldState, taskId: string) => {
  if (!state.player) {
    return state;
  }

  const task = state.tasks.find((entry) => entry.id === taskId);

  if (!task) {
    return state;
  }

  const reward = rewardEngine.resolve(task);
  const completionTimestamp = task.completed ? undefined : new Date().toISOString();
  const nextProgress = task.completed
    ? removeProgressReward(state.player.progress, reward.xp, reward.gold)
    : applyProgressReward(state.player.progress, reward.xp, reward.gold);

  return {
    ...state,
    player: {
      ...state.player,
      progress: nextProgress
    },
    activityHistory: task.completed
      ? state.activityHistory.filter((entry) => !(entry.taskId === taskId && entry.completedAt === task.completedAt))
      : completionTimestamp
        ? [
            {
              id: `history-${taskId}-${completionTimestamp}`,
              taskId,
              taskTitle: task.title,
              taskIcon: task.icon,
              frequency: task.frequency,
              dailyQuestType: task.dailyQuestType,
              reward,
              completedAt: completionTimestamp
            },
            ...state.activityHistory
          ]
        : state.activityHistory,
    tasks: state.tasks.map((entry) =>
      entry.id === taskId
        ? {
            ...entry,
            completed: !task.completed,
            completedAt: completionTimestamp,
            reward
          }
        : entry
    )
  };
};

export const removeTask = (state: WorldState, taskId: string): WorldState => ({
  ...state,
  tasks: state.tasks.filter((task) => task.id !== taskId),
  dailyReports: state.dailyReports.map((report) => ({
    ...report,
    missedTaskIds: report.missedTaskIds.filter((id) => id !== taskId)
  }))
});

export const purchaseShopItem = (state: WorldState, itemId: ShopItemId): WorldState => {
  const item = getShopItem(itemId);

  if (!state.player || !item) {
    return state;
  }

  if (state.shopUnlocks.purchasedItemIds.includes(itemId)) {
    return state;
  }

  if (state.player.progress.gold < item.cost) {
    return state;
  }

  return {
    ...state,
    player: {
      ...state.player,
      progress: {
        ...state.player.progress,
        gold: state.player.progress.gold - item.cost
      }
    },
    shopUnlocks: {
      purchasedItemIds: [...state.shopUnlocks.purchasedItemIds, itemId],
      equippedCompanionId:
        item.category === "companion" && !state.shopUnlocks.equippedCompanionId
          ? itemId
          : state.shopUnlocks.equippedCompanionId
    }
  };
};

export const equipCompanion = (state: WorldState, itemId: ShopItemId): WorldState => {
  const item = getShopItem(itemId);

  if (!item || item.category !== "companion") {
    return state;
  }

  if (!state.shopUnlocks.purchasedItemIds.includes(itemId)) {
    return state;
  }

  return {
    ...state,
    shopUnlocks: {
      ...state.shopUnlocks,
      equippedCompanionId: itemId
    }
  };
};

export const setOnboardingSeen = (state: WorldState): WorldState => ({
  ...state,
  preferences: {
    ...state.preferences,
    hasSeenOnboarding: true
  }
});

export const clearHistory = (state: WorldState): WorldState => ({
  ...state,
  dailyReports: [],
  activityHistory: [],
  lastReportGeneratedFor: undefined
});
