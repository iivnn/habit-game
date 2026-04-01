import type { RewardPolicy } from "@/domain/tasks/RewardPolicy";
import type { HabitTask } from "@/domain/types";

export class FrequencyRewardPolicy implements RewardPolicy {
  canHandle() {
    return true;
  }

  resolve(task: HabitTask) {
    return task.reward;
  }
}
