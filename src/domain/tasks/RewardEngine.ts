import { FrequencyRewardPolicy } from "@/domain/tasks/FrequencyRewardPolicy";
import type { RewardPolicy } from "@/domain/tasks/RewardPolicy";
import type { HabitTask, Reward } from "@/domain/types";

export class RewardEngine {
  constructor(private readonly policies: RewardPolicy[]) {}

  static default() {
    return new RewardEngine([new FrequencyRewardPolicy()]);
  }

  resolve(task: HabitTask): Reward {
    const policy = this.policies.find((entry) => entry.canHandle(task));

    if (!policy) {
      return task.reward;
    }

    return policy.resolve(task);
  }
}
