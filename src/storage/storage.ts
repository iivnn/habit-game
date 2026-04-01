import AsyncStorage from "@react-native-async-storage/async-storage";
import { createInitialState } from "@/domain/GameEngine";
import type { WorldState } from "@/domain/types";

const STORAGE_KEY = "habit-quest-world-state";

export const loadWorldState = async (): Promise<WorldState> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<WorldState>;
    const initial = createInitialState();

    return {
      ...initial,
      ...parsed,
      preferences: {
        ...initial.preferences,
        ...parsed.preferences
      },
      shopUnlocks: {
        ...initial.shopUnlocks,
        ...parsed.shopUnlocks
      }
    };
  } catch {
    return createInitialState();
  }
};

export const saveWorldState = async (state: WorldState) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearWorldState = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
