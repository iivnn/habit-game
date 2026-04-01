export type TaskFrequency = "daily" | "weekly";
export type DailyQuestType = "main" | "secondary" | "optional";
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CharacterClassId =
  | "warrior"
  | "archer"
  | "mage"
  | "rogue"
  | "cleric"
  | "sorcerer"
  | "knight";

export type TaskId = string;
export type ShopItemId = string;
export type ShopCategory = "hero" | "village" | "companion";

export interface Reward {
  gold: number;
  xp: number;
}

export interface ScheduledAlert {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface HabitTask {
  id: TaskId;
  title: string;
  description?: string;
  frequency: TaskFrequency;
  dailyQuestType?: DailyQuestType;
  activeWeekdays?: Weekday[];
  reward: Reward;
  completed: boolean;
  icon?: string;
  color?: string;
  alert?: ScheduledAlert;
  createdAt: string;
  completedAt?: string;
}

export interface PlayerProgress {
  level: number;
  xp: number;
  gold: number;
}

export interface PlayerCharacter {
  name: string;
  classId: CharacterClassId;
  progress: PlayerProgress;
}

export interface DailyReport {
  id: string;
  date: string;
  summary: string;
  missedTaskIds: TaskId[];
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

export interface TaskHistoryEntry {
  id: string;
  taskId: TaskId;
  taskTitle: string;
  taskIcon?: string;
  frequency: TaskFrequency;
  dailyQuestType?: DailyQuestType;
  reward: Reward;
  completedAt: string;
}

export interface ShopUnlocks {
  purchasedItemIds: ShopItemId[];
  equippedCompanionId?: ShopItemId;
}

export interface AppPreferences {
  hasSeenOnboarding: boolean;
}

export interface WorldState {
  player?: PlayerCharacter;
  tasks: HabitTask[];
  dailyReports: DailyReport[];
  activityHistory: TaskHistoryEntry[];
  shopUnlocks: ShopUnlocks;
  preferences: AppPreferences;
  lastDailyResetAt?: string;
  lastWeeklyResetAt?: string;
  lastReportGeneratedFor?: string;
}
