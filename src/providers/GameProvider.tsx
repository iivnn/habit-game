import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";
import { clearHistory, createInitialState, createPlayer, createTask, equipCompanion, purchaseShopItem, removeTask, setOnboardingSeen, toggleTaskCompletion, updateTask } from "@/domain/GameEngine";
import { getCharacterClass } from "@/domain/classes/registry";
import { applyResets, createEndOfDayReportIfNeeded } from "@/domain/ResetService";
import type { CharacterClassId, DailyQuestType, HabitTask, ShopItemId, Weekday, WorldState } from "@/domain/types";
import { allWeekdays } from "@/utils/date";
import { requestNotificationPermission, syncTaskNotifications } from "@/services/notifications";
import { clearWorldState, loadWorldState, saveWorldState } from "@/storage/storage";

interface CreateTaskInput {
  title: string;
  description?: string;
  frequency: HabitTask["frequency"];
  dailyQuestType?: DailyQuestType;
  activeWeekdays?: Weekday[];
  rewardGold: number;
  rewardXp: number;
  alertHour?: number;
  alertMinute?: number;
  icon?: string;
  color?: string;
}

interface UpdateTaskInput extends CreateTaskInput {
  taskId: string;
}

interface GameContextValue {
  state: WorldState;
  ready: boolean;
  selectClass: (name: string, classId: CharacterClassId) => void;
  addTask: (input: CreateTaskInput) => void;
  editTask: (input: UpdateTaskInput) => void;
  finishTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  buyShopItem: (itemId: ShopItemId) => void;
  setEquippedCompanion: (itemId: ShopItemId) => void;
  dismissOnboarding: () => void;
  clearHistory: () => void;
  resetGame: () => void;
  classLabel?: string;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

const buildTaskDraft = (input: CreateTaskInput) => ({
  title: input.title,
  description: input.description,
  frequency: input.frequency,
  dailyQuestType: input.frequency === "daily" ? input.dailyQuestType ?? "main" : undefined,
  activeWeekdays: input.frequency === "daily" ? input.activeWeekdays ?? allWeekdays : undefined,
  reward: {
    gold: input.rewardGold,
    xp: input.rewardXp
  },
  icon: input.icon,
  color: input.color,
  alert:
    input.frequency === "daily" && (input.dailyQuestType ?? "main") === "main"
      ? {
          enabled: true,
          hour: input.alertHour ?? 8,
          minute: input.alertMinute ?? 0
        }
      : undefined
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<WorldState>(createInitialState());
  const [ready, setReady] = useState(false);

  const refreshStateForTimeRules = (currentState: WorldState) => {
    const now = new Date();
    const withReport = createEndOfDayReportIfNeeded(currentState, now);
    return applyResets(withReport, now);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const loadedState = await loadWorldState();
      const hydrated = refreshStateForTimeRules(loadedState);

      setState(hydrated);
      setReady(true);

      await requestNotificationPermission();
      await syncTaskNotifications(hydrated.tasks);
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        setState((current) => refreshStateForTimeRules(current));
      }
    });

    return () => {
      subscription.remove();
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    void saveWorldState(state);
    void syncTaskNotifications(state.tasks);
  }, [ready, state]);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      ready,
      selectClass: (name, classId) => {
        setState((current) => ({
          ...current,
          player: createPlayer(name, classId)
        }));
      },
      addTask: (input) => {
        setState((current) => ({
          ...current,
          tasks: [
            createTask(buildTaskDraft(input)),
            ...current.tasks
          ]
        }));
      },
      editTask: (input) => {
        setState((current) => updateTask(current, input.taskId, buildTaskDraft(input)));
      },
      finishTask: (taskId) => {
        setState((current) => toggleTaskCompletion(current, taskId));
      },
      deleteTask: (taskId) => {
        setState((current) => removeTask(current, taskId));
      },
      buyShopItem: (itemId) => {
        setState((current) => purchaseShopItem(current, itemId));
      },
      setEquippedCompanion: (itemId) => {
        setState((current) => equipCompanion(current, itemId));
      },
      dismissOnboarding: () => {
        setState((current) => setOnboardingSeen(current));
      },
      clearHistory: () => {
        setState((current) => clearHistory(current));
      },
      resetGame: () => {
        const nextState = createInitialState();
        setState(nextState);
        void clearWorldState();
      },
      classLabel: state.player ? getCharacterClass(state.player.classId).name : undefined
    }),
    [ready, state]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
};
