import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Animated, Pressable, Text, TextInput, View } from "react-native";
import type { DailyQuestType, HabitTask, Weekday } from "@/domain/types";
import { ClockIcon, CoinIcon, HourglassIcon, XpIcon } from "@/components/HeaderIcons";
import { theme } from "@/theme";
import { allWeekdays, formatTime, weekdayShortLabels } from "@/utils/date";

const questIcons = ["⚔️", "🛡️", "✨", "📚", "🏹", "💧", "🦷", "🔥", "🍎", "🏃", "🧘", "🛌"];
const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 12 }, (_, index) => index * 5);

interface TaskDraftInput {
  title: string;
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

const TimeWheel = ({
  icon,
  label,
  value,
  options,
  onChange
}: {
  icon: ReactNode;
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) => {
  const index = Math.max(0, options.indexOf(value));
  const previous = options[(index - 1 + options.length) % options.length];
  const next = options[(index + 1) % options.length];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.panelAlt,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        padding: 10,
        gap: 8
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{label}</Text>
      </View>
      <Pressable onPress={() => onChange(previous)} style={{ alignItems: "center", paddingVertical: 4 }}>
        <Text style={{ color: theme.colors.muted, fontSize: 16 }}>▲</Text>
      </Pressable>
      <View
        style={{
          backgroundColor: theme.colors.panelDeep,
          borderRadius: 10,
          paddingVertical: 10,
          alignItems: "center"
        }}
      >
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900" }}>{value.toString().padStart(2, "0")}</Text>
      </View>
      <Pressable onPress={() => onChange(next)} style={{ alignItems: "center", paddingVertical: 4 }}>
        <Text style={{ color: theme.colors.muted, fontSize: 16 }}>▼</Text>
      </Pressable>
    </View>
  );
};

const getInitialValues = (task?: HabitTask) => ({
  title: task?.title ?? "",
  frequency: task?.frequency ?? ("daily" as HabitTask["frequency"]),
  dailyQuestType: task?.dailyQuestType ?? ("main" as DailyQuestType),
  activeWeekdays: task?.activeWeekdays?.length ? task.activeWeekdays : allWeekdays,
  hour: task?.alert?.hour ?? 8,
  minute: task?.alert?.minute ?? 0,
  rewardGold: String(task?.reward.gold ?? 15),
  rewardXp: String(task?.reward.xp ?? 20),
  icon: task?.icon ?? "⚔️"
});

export const TaskCreator = ({
  task,
  onSubmit,
  onCancel
}: {
  task?: HabitTask;
  onSubmit: (payload: TaskDraftInput) => void;
  onCancel?: () => void;
}) => {
  const initialValues = getInitialValues(task);
  const [title, setTitle] = useState(initialValues.title);
  const [frequency, setFrequency] = useState<HabitTask["frequency"]>(initialValues.frequency);
  const [dailyQuestType, setDailyQuestType] = useState<DailyQuestType>(initialValues.dailyQuestType);
  const [activeWeekdays, setActiveWeekdays] = useState<Weekday[]>(initialValues.activeWeekdays);
  const [hour, setHour] = useState(initialValues.hour);
  const [minute, setMinute] = useState(initialValues.minute);
  const [rewardGold, setRewardGold] = useState(initialValues.rewardGold);
  const [rewardXp, setRewardXp] = useState(initialValues.rewardXp);
  const [icon, setIcon] = useState(initialValues.icon);
  const [showSuccess, setShowSuccess] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(8)).current;

  const isEditing = Boolean(task);
  const isWeekly = frequency === "weekly";
  const shouldShowAlert = frequency === "daily" && dailyQuestType === "main";

  useEffect(() => {
    const nextValues = getInitialValues(task);
    setTitle(nextValues.title);
    setFrequency(nextValues.frequency);
    setDailyQuestType(nextValues.dailyQuestType);
    setActiveWeekdays(nextValues.activeWeekdays);
    setHour(nextValues.hour);
    setMinute(nextValues.minute);
    setRewardGold(nextValues.rewardGold);
    setRewardXp(nextValues.rewardXp);
    setIcon(nextValues.icon);
    setShowSuccess(false);
  }, [task]);

  useEffect(() => {
    if (!showSuccess) {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true
        }),
        Animated.timing(toastTranslateY, {
          toValue: 8,
          duration: 160,
          useNativeDriver: true
        })
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true
      })
    ]).start();

    const timeout = setTimeout(() => {
      setShowSuccess(false);
    }, 2200);

    return () => clearTimeout(timeout);
  }, [showSuccess, toastOpacity, toastTranslateY]);

  const toggleWeekday = (weekday: Weekday) => {
    setActiveWeekdays((current) => {
      const exists = current.includes(weekday);

      if (exists && current.length === 1) {
        return current;
      }

      return exists ? current.filter((entry) => entry !== weekday) : [...current, weekday].sort((left, right) => left - right);
    });
  };

  const resetForm = () => {
    const blankValues = getInitialValues();
    setTitle(blankValues.title);
    setFrequency(blankValues.frequency);
    setDailyQuestType(blankValues.dailyQuestType);
    setActiveWeekdays(blankValues.activeWeekdays);
    setHour(blankValues.hour);
    setMinute(blankValues.minute);
    setRewardGold(blankValues.rewardGold);
    setRewardXp(blankValues.rewardXp);
    setIcon(blankValues.icon);
  };

  const submit = () => {
    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      frequency,
      dailyQuestType: isWeekly ? undefined : dailyQuestType,
      activeWeekdays: isWeekly ? undefined : activeWeekdays,
      rewardGold: Math.max(0, Number(rewardGold) || 0),
      rewardXp: Math.max(0, Number(rewardXp) || 0),
      alertHour: shouldShowAlert ? hour : undefined,
      alertMinute: shouldShowAlert ? minute : undefined,
      icon
    });

    setShowSuccess(true);

    if (!isEditing) {
      resetForm();
    }
  };

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text style={{ color: theme.colors.muted }}>
        {isEditing
          ? "Ajuste a tarefa sem perder o restante da sua jornada."
          : "Cadastre uma nova tarefa, defina a recorrência e configure o horário do lembrete."}
      </Text>
      <TextInput
        placeholder="Nome da tarefa"
        placeholderTextColor="#7c97ae"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: theme.colors.panelAlt,
          color: theme.colors.text,
          borderWidth: 2,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.sm,
          padding: theme.spacing.md
        }}
      />

      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
        {(["daily", "weekly"] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setFrequency(item)}
            style={{
              flex: 1,
              backgroundColor: frequency === item ? theme.colors.warning : theme.colors.panelAlt,
              borderColor: frequency === item ? "#ffd27c" : theme.colors.border,
              borderWidth: 2,
              borderRadius: theme.radius.sm,
              padding: 12,
              alignItems: "center"
            }}
          >
            <Text style={{ color: frequency === item ? "#412500" : theme.colors.text, fontWeight: "900" }}>
              {item === "daily" ? "Diária" : "Semanal"}
            </Text>
          </Pressable>
        ))}
      </View>

      {!isWeekly ? (
        <View style={{ gap: theme.spacing.sm }}>
          <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Tipo da missão diária</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {([
              { id: "main", label: "Principal" },
              { id: "secondary", label: "Secundária" },
              { id: "optional", label: "Opcional" }
            ] as const).map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setDailyQuestType(item.id)}
                style={{
                  flex: 1,
                  backgroundColor: dailyQuestType === item.id ? theme.colors.warning : theme.colors.panelAlt,
                  borderColor: dailyQuestType === item.id ? "#ffd27c" : theme.colors.border,
                  borderWidth: 2,
                  borderRadius: theme.radius.sm,
                  minHeight: 42,
                  paddingHorizontal: 6,
                  paddingVertical: 8,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  style={{
                    color: dailyQuestType === item.id ? "#412500" : theme.colors.text,
                    fontWeight: "900",
                    fontSize: 12
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Dias ativos</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {allWeekdays.map((weekday) => {
              const selected = activeWeekdays.includes(weekday);

              return (
                <Pressable
                  key={weekday}
                  onPress={() => toggleWeekday(weekday)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: selected ? theme.colors.warning : theme.colors.panelAlt,
                    borderColor: selected ? "#ffd27c" : theme.colors.border,
                    borderWidth: 2
                  }}
                >
                  <Text style={{ color: selected ? "#412500" : theme.colors.text, fontWeight: "900" }}>
                    {weekdayShortLabels[weekday]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: theme.colors.panelAlt,
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.sm,
            paddingHorizontal: 12
          }}
        >
          <CoinIcon size={18} />
          <TextInput
            value={rewardGold}
            onChangeText={setRewardGold}
            keyboardType="number-pad"
            placeholder="Gold"
            placeholderTextColor="#7c97ae"
            style={{
              flex: 1,
              color: theme.colors.text,
              paddingVertical: theme.spacing.md
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: theme.colors.panelAlt,
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.sm,
            paddingHorizontal: 12
          }}
        >
          <XpIcon size={18} />
          <TextInput
            value={rewardXp}
            onChangeText={setRewardXp}
            keyboardType="number-pad"
            placeholder="XP"
            placeholderTextColor="#7c97ae"
            style={{
              flex: 1,
              color: theme.colors.text,
              paddingVertical: theme.spacing.md
            }}
          />
        </View>
      </View>

      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Ícone da quest</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {questIcons.map((entry) => (
            <Pressable
              key={entry}
              onPress={() => setIcon(entry)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: icon === entry ? theme.colors.warning : theme.colors.panelAlt,
                borderColor: icon === entry ? "#ffd27c" : theme.colors.border,
                borderWidth: 2
              }}
            >
              <Text style={{ fontSize: 20 }}>{entry}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {shouldShowAlert ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Horário do lembrete</Text>
          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <TimeWheel icon={<ClockIcon size={18} />} label="Hora" value={hour} options={hours} onChange={setHour} />
            <TimeWheel icon={<HourglassIcon size={18} />} label="Minuto" value={minute} options={minutes} onChange={setMinute} />
          </View>
          <Text style={{ color: theme.colors.muted }}>Horário selecionado: {formatTime(hour, minute)}</Text>
        </View>
      ) : (
        <Text style={{ color: theme.colors.muted }}>
          {isWeekly
            ? "Tarefas semanais não possuem alerta."
            : dailyQuestType === "optional"
              ? "Missões opcionais não geram alerta nem entram nas somatórias diárias."
              : "Missões secundárias não possuem alerta."}
        </Text>
      )}

      <View style={{ flexDirection: "row", gap: 10 }}>
        {isEditing && onCancel ? (
          <Pressable
            onPress={onCancel}
            style={{
              flex: 1,
              backgroundColor: theme.colors.panelAlt,
              borderColor: theme.colors.border,
              borderWidth: 2,
              borderRadius: theme.radius.sm,
              paddingVertical: 12,
              alignItems: "center"
            }}
          >
            <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>Cancelar</Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={submit}
          style={{
            flex: 1,
            backgroundColor: theme.colors.success,
            borderColor: "#bff0c9",
            borderWidth: 2,
            borderRadius: theme.radius.sm,
            paddingVertical: 12,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#112418", fontWeight: "900", fontSize: 16 }}>{isEditing ? "Salvar alterações" : "Salvar tarefa"}</Text>
        </Pressable>
      </View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          alignSelf: "center",
          bottom: -22,
          opacity: toastOpacity,
          transform: [{ translateY: toastTranslateY }]
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(15, 18, 24, 0.94)",
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 9,
            shadowColor: "#000",
            shadowOpacity: 0.22,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            minWidth: 168,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#f4f7fb", fontWeight: "700", fontSize: 13 }}>
            {isEditing ? "Tarefa atualizada com sucesso" : "Tarefa criada com sucesso"}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};
