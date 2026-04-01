import type { HabitTask, Reward } from "@/domain/types";

export interface RewardPolicy {
  canHandle(task: HabitTask): boolean;
  resolve(task: HabitTask): Reward;
}
