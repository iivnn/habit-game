import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";
import type { HabitTask } from "@/domain/types";
import { theme } from "@/theme";
import { formatTime } from "@/utils/date";

const isWeb = Platform.OS === "web";

const getQuestTypeMeta = (task: HabitTask) => {
  if (task.frequency !== "daily") {
    return null;
  }

  if (task.dailyQuestType === "main") {
    return { symbol: "◆", label: "Principal", color: "#f2b35d" };
  }

  if (task.dailyQuestType === "secondary") {
    return { symbol: "●", label: "Secundária", color: "#79d5ff" };
  }

  if (task.dailyQuestType === "optional") {
    return { symbol: "○", label: "Opcional", color: "#b7c9d6" };
  }

  return null;
};

export const TaskCard = ({
  task,
  onComplete,
  onLongPress,
  onWebDelete
}: {
  task: HabitTask;
  onComplete: () => void;
  onLongPress: () => void;
  onWebDelete?: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(task.completed ? 1 : 0)).current;
  const previousCompleted = useRef(task.completed);
  const questTypeMeta = getQuestTypeMeta(task);

  useEffect(() => {
    if (!previousCompleted.current && task.completed) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 0.98,
            duration: 90,
            useNativeDriver: true
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            tension: 120,
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 140,
            useNativeDriver: false
          }),
          Animated.timing(glow, {
            toValue: 0.72,
            duration: 220,
            useNativeDriver: false
          })
        ])
      ]).start();
    }

    if (previousCompleted.current && !task.completed) {
      Animated.timing(glow, {
        toValue: 0,
        duration: 140,
        useNativeDriver: false
      }).start();
    }

    previousCompleted.current = task.completed;
  }, [glow, scale, task.completed]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }]
      }}
    >
      <Pressable
        onPress={onComplete}
        onLongPress={onLongPress}
        delayLongPress={280}
        style={{
          backgroundColor: theme.colors.panelEdge,
          borderColor: "#08111d",
          borderWidth: 2,
          borderRadius: theme.radius.sm + 2,
          padding: 3
        }}
      >
        <Animated.View
          style={{
            backgroundColor: theme.colors.panelAlt,
            borderColor: task.completed ? theme.colors.success : task.color ?? theme.colors.border,
            borderWidth: 2,
            borderRadius: theme.radius.sm,
            paddingHorizontal: theme.spacing.md,
            paddingTop: 12,
            paddingBottom: isWeb && onWebDelete ? 14 : 12,
            gap: 4,
            shadowColor: theme.colors.success,
            shadowOpacity: glow,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 }
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing.sm, alignItems: "flex-start" }}>
            <View style={{ flex: 1, gap: 3, paddingRight: 8 }}>
              <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: "900" }}>
                {task.icon ? `${task.icon} ` : ""}
                {task.title}
              </Text>
              {questTypeMeta ? (
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: theme.colors.panelDeep,
                    borderRadius: 999,
                    paddingHorizontal: 8,
                    paddingVertical: 3
                  }}
                >
                  <Text style={{ color: questTypeMeta.color, fontSize: 10, fontWeight: "900" }}>{questTypeMeta.symbol}</Text>
                  <Text style={{ color: questTypeMeta.color, fontSize: 11, fontWeight: "900" }}>{questTypeMeta.label}</Text>
                </View>
              ) : null}
              <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                {task.frequency === "daily" ? "Missão diária" : "Missão semanal"} | {task.reward.gold} gold | {task.reward.xp} xp
              </Text>
              <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                Alerta programado: {task.alert?.enabled ? formatTime(task.alert.hour, task.alert.minute) : "desativado"}
              </Text>
            </View>

            <Animated.View
              style={{
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: task.completed ? theme.colors.success : theme.colors.panelDeep,
                borderColor: task.completed ? "#bff0c9" : theme.colors.border,
                borderWidth: 2,
                borderRadius: 999,
                transform: [
                  {
                    scale: glow.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.12]
                    })
                  }
                ]
              }}
            >
              <Text style={{ color: task.completed ? "#102317" : theme.colors.muted, fontWeight: "900", fontSize: 12 }}>
                {task.completed ? "✓" : ""}
              </Text>
            </Animated.View>
          </View>

          {isWeb && onWebDelete ? (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 2 }}>
              <Pressable
                onPress={onWebDelete}
                style={{
                  minWidth: 36,
                  minHeight: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5
                }}
              >
                <Text style={{ color: theme.colors.danger, fontSize: 20, lineHeight: 20 }}>🗑</Text>
              </Pressable>
            </View>
          ) : null}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};
