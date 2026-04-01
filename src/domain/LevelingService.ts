import type { PlayerProgress } from "@/domain/types";

const BASE_XP = 100;

export const getXpForNextLevel = (level: number) => BASE_XP * 2 ** Math.max(0, level - 1);

export const applyProgressReward = (progress: PlayerProgress, rewardXp: number, rewardGold: number): PlayerProgress => {
  let level = progress.level;
  let xp = progress.xp + rewardXp;

  while (xp >= getXpForNextLevel(level)) {
    xp -= getXpForNextLevel(level);
    level += 1;
  }

  return {
    level,
    xp,
    gold: progress.gold + rewardGold
  };
};

export const removeProgressReward = (progress: PlayerProgress, rewardXp: number, rewardGold: number): PlayerProgress => {
  let level = progress.level;
  let xp = progress.xp - rewardXp;

  while (xp < 0 && level > 1) {
    level -= 1;
    xp += getXpForNextLevel(level);
  }

  return {
    level: Math.max(1, level),
    xp: Math.max(0, xp),
    gold: Math.max(0, progress.gold - rewardGold)
  };
};
