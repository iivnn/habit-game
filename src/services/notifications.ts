import * as Notifications from "expo-notifications";
import type { HabitTask } from "@/domain/types";
import { allWeekdays } from "@/utils/date";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export const requestNotificationPermission = async () => {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.granted) {
    return true;
  }

  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
};

export const syncTaskNotifications = async (tasks: HabitTask[]) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const eligibleTasks = tasks.filter((task) => task.alert?.enabled);

  await Promise.all(
    eligibleTasks.flatMap((task) => {
      const weekdays = task.activeWeekdays?.length ? task.activeWeekdays : allWeekdays;

      return weekdays.map((weekday) =>
        Notifications.scheduleNotificationAsync({
          content: {
            title: `Quest ativa: ${task.title}`,
            body: "O reino aguarda sua rotina de hoje.",
            sound: true
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: weekday + 1,
            hour: task.alert?.hour ?? 9,
            minute: task.alert?.minute ?? 0
          }
        })
      );
    })
  );
};
