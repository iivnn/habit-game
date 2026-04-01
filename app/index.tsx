import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Share } from "react-native";
import { Animated, ScrollView, Text, View, Pressable, Vibration } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClassPicker } from "@/components/ClassPicker";
import { CompanionCollection } from "@/components/CompanionCollection";
import { HistoryPanel } from "@/components/HistoryPanel";
import { OnboardingModal } from "@/components/OnboardingModal";
import { Panel } from "@/components/Panel";
import { StreakCalendar } from "@/components/StreakCalendar";
import { TaskCard } from "@/components/TaskCard";
import { TaskCreator } from "@/components/TaskCreator";
import { getCompanionThemes, getShopItem } from "@/domain/shop/catalog";
import { AnimatedCharacterSprite } from "@/components/pixel/AnimatedCharacterSprite";
import { SpriteFrame } from "@/components/pixel/SpriteFrame";
import { CoinIcon, GearIcon, HabitQuestIcon, XpIcon } from "@/components/HeaderIcons";
import { useGameStats } from "@/hooks/useGameStats";
import { useGame } from "@/providers/GameProvider";
import { theme } from "@/theme";
import type { CharacterClassId, HabitTask } from "@/domain/types";
import { isTaskActiveOnDate } from "@/utils/date";

type HomeTab = "quests" | "history" | "forge" | "market" | "settings";

export default function HomeScreen() {
  const { state, ready, selectClass, addTask, editTask, finishTask, deleteTask, buyShopItem, setEquippedCompanion, dismissOnboarding, resetGame, classLabel } = useGame();
  const stats = useGameStats();
  const [heroName, setHeroName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<CharacterClassId>("warrior");
  const [activeTab, setActiveTab] = useState<HomeTab>("quests");
  const [selectedCompanionTheme, setSelectedCompanionTheme] = useState(getCompanionThemes()[0] ?? "Floresta");
  const [selectedCompanionId, setSelectedCompanionId] = useState<string | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<HabitTask | undefined>(undefined);
  const [isOnboardingPreviewOpen, setIsOnboardingPreviewOpen] = useState(false);
  const [rewardBurst, setRewardBurst] = useState<{ xp: number; gold: number } | null>(null);
  const rewardOpacity = useRef(new Animated.Value(0)).current;
  const rewardTranslateY = useRef(new Animated.Value(0)).current;
  const companionFloat = useRef(new Animated.Value(0)).current;

  const latestReport = state.dailyReports[0];
  const purchasedItemIds = state.shopUnlocks?.purchasedItemIds ?? [];
  const activeCompanion = state.shopUnlocks?.equippedCompanionId ? getShopItem(state.shopUnlocks.equippedCompanionId)?.icon ?? null : null;

  const groupedTasks = useMemo(
    () => {
      const today = new Date();
      const sortByAlertTime = (left: (typeof state.tasks)[number], right: (typeof state.tasks)[number]) => {
        const leftOptional = left.dailyQuestType === "optional";
        const rightOptional = right.dailyQuestType === "optional";

        if (leftOptional && !rightOptional) {
          return 1;
        }

        if (!leftOptional && rightOptional) {
          return -1;
        }

        const leftHasAlert = Boolean(left.alert?.enabled);
        const rightHasAlert = Boolean(right.alert?.enabled);

        if (leftHasAlert && rightHasAlert) {
          const leftMinutes = (left.alert?.hour ?? 0) * 60 + (left.alert?.minute ?? 0);
          const rightMinutes = (right.alert?.hour ?? 0) * 60 + (right.alert?.minute ?? 0);
          return leftMinutes - rightMinutes;
        }

        if (leftHasAlert) {
          return -1;
        }

        if (rightHasAlert) {
          return 1;
        }

        return left.title.localeCompare(right.title);
      };

      return {
        daily: state.tasks.filter((task) => task.frequency === "daily" && isTaskActiveOnDate(task, today)).sort(sortByAlertTime),
        weekly: state.tasks.filter((task) => task.frequency === "weekly").sort(sortByAlertTime)
      };
    },
    [state.tasks]
  );

  const confirmReset = () => {
    Alert.alert(
      "Resetar progresso",
      "Isso vai apagar o personagem atual, tarefas e relatórios salvos. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Resetar", style: "destructive", onPress: resetGame }
      ]
    );
  };

  const confirmDeleteTask = (taskId: string, taskTitle: string) => {
    Alert.alert("Excluir tarefa", `Deseja excluir a tarefa "${taskTitle}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deleteTask(taskId) }
    ]);
  };

  const openTaskActions = (task: HabitTask) => {
    Alert.alert(task.title, "Escolha uma ação para essa tarefa.", [
      {
        text: "Editar",
        onPress: () => {
          setEditingTask(task);
          setActiveTab("forge");
        }
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => confirmDeleteTask(task.id, task.title)
      },
      { text: "Cancelar", style: "cancel" }
    ]);
  };

  const handleTaskSubmit = (payload: {
    title: string;
    frequency: HabitTask["frequency"];
    dailyQuestType?: HabitTask["dailyQuestType"];
    activeWeekdays?: HabitTask["activeWeekdays"];
    rewardGold: number;
    rewardXp: number;
    alertHour?: number;
    alertMinute?: number;
    icon?: string;
    color?: string;
  }) => {
    if (editingTask) {
      editTask({
        taskId: editingTask.id,
        ...payload
      });
      setEditingTask(undefined);
      setActiveTab("quests");
      return;
    }

    addTask(payload);
  };

  const exportBackup = async () => {
    await Share.share({
      title: "Habit Quest Backup",
      message: JSON.stringify(state, null, 2)
    });
  };

  useEffect(() => {
    if (!rewardBurst) {
      return;
    }

    rewardOpacity.setValue(1);
    rewardTranslateY.setValue(0);

    const animation = Animated.parallel([
      Animated.timing(rewardOpacity, {
        toValue: 0,
        duration: 1100,
        useNativeDriver: true
      }),
      Animated.timing(rewardTranslateY, {
        toValue: -34,
        duration: 1100,
        useNativeDriver: true
      })
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        setRewardBurst(null);
      }
    });

    return () => {
      animation.stop();
    };
  }, [rewardBurst, rewardOpacity, rewardTranslateY]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(companionFloat, {
          toValue: -4,
          duration: 1300,
          useNativeDriver: true
        }),
        Animated.timing(companionFloat, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true
        })
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [companionFloat]);

  const handleToggleTask = (taskId: string, completed: boolean) => {
    const task = state.tasks.find((entry) => entry.id === taskId);

    if (!completed) {
      Vibration.vibrate(28);
      if (task) {
        setRewardBurst({
          xp: task.reward.xp,
          gold: task.reward.gold
        });
      }
    }

    finishTask(taskId);
  };

  if (!ready) {
    return (
      <LinearGradient colors={[theme.colors.bgTop, theme.colors.bgBottom]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>Carregando o reino...</Text>
      </LinearGradient>
    );
  }

  if (!state.player) {
    return (
      <LinearGradient colors={[theme.colors.skyTop, theme.colors.bgBottom]} style={{ flex: 1, padding: theme.spacing.lg, paddingTop: 80 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ClassPicker
            name={heroName}
            onChangeName={setHeroName}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            onConfirm={() => selectClass(heroName.trim() || "Aventureiro", selectedClassId)}
          />
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.colors.skyTop, theme.colors.bgBottom]} style={{ flex: 1 }}>
      <OnboardingModal
        visible={Boolean(state.player) && (!state.preferences.hasSeenOnboarding || isOnboardingPreviewOpen)}
        onClose={() => {
          if (!state.preferences.hasSeenOnboarding) {
            dismissOnboarding();
          }

          setIsOnboardingPreviewOpen(false);
        }}
      />
      {rewardBurst ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 118,
            right: 20,
            zIndex: 20,
            opacity: rewardOpacity,
            transform: [{ translateY: rewardTranslateY }]
          }}
        >
          <View style={{ alignItems: "flex-end", gap: 2 }}>
            <Text style={{ color: theme.colors.xp, fontWeight: "900", fontSize: 18 }}>+{rewardBurst.xp} XP</Text>
            <Text style={{ color: theme.colors.gold, fontWeight: "900", fontSize: 18 }}>+{rewardBurst.gold} Gold</Text>
          </View>
        </Animated.View>
      ) : null}

      <SafeAreaView edges={["top"]} style={{ backgroundColor: "rgba(12, 19, 33, 0.7)" }}>
        <View
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingTop: 6,
            paddingBottom: 10,
            backgroundColor: "rgba(12, 19, 33, 0.55)",
            borderBottomColor: theme.colors.border,
            borderBottomWidth: 2
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.panelDeep,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <HabitQuestIcon size={38} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: "900", letterSpacing: 1.1 }}>
                  HABIT QUEST
                </Text>
                <Text style={{ color: theme.colors.muted, fontSize: 10 }}>
                  rotina, progresso e evolução do personagem
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: theme.colors.panelEdge,
                  borderColor: theme.colors.border,
                  borderWidth: 2,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 8
                }}
              >
                <Pressable
                  onPress={() => setActiveTab("market")}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <CoinIcon size={18} />
                  <Text style={{ color: theme.colors.gold, fontWeight: "900" }}>{stats?.gold}</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => setActiveTab("settings")}
                style={{
                  width: 38,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: activeTab === "settings" ? theme.colors.warning : theme.colors.panelEdge,
                  borderColor: activeTab === "settings" ? "#ffd68a" : theme.colors.border,
                  borderWidth: 2,
                  borderRadius: 12
                }}
              >
                <GearIcon size={18} />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, paddingTop: 18, paddingBottom: 96, gap: theme.spacing.md }}>
        <Panel>
          <View style={{ flexDirection: "row", gap: theme.spacing.md, alignItems: "center", minHeight: 172 }}>
            <View style={{ alignItems: "center", justifyContent: "center", minWidth: 128 }}>
              <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
                {activeCompanion ? (
                  <Animated.View
                    style={{
                      position: "absolute",
                      right: -8,
                      top: 6,
                      zIndex: 2,
                      transform: [{ translateY: companionFloat }]
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.colors.panelDeep,
                        borderColor: theme.colors.border,
                        borderWidth: 2
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{activeCompanion}</Text>
                    </View>
                  </Animated.View>
                ) : null}
                <SpriteFrame>
                  <AnimatedCharacterSprite classId={state.player.classId} pixelSize={5} amplitude={4} duration={1500} />
                </SpriteFrame>
              </View>
            </View>
            <View style={{ flex: 1, gap: 6, minHeight: 132, justifyContent: "center" }}>
              <Text numberOfLines={1} style={{ color: theme.colors.text, fontSize: 24, fontWeight: "900" }}>
                {state.player.name}
              </Text>
              <Text numberOfLines={1} style={{ color: theme.colors.muted }}>
                {classLabel} | Nível {stats?.level}
              </Text>
              <View
                style={{
                  backgroundColor: theme.colors.panelDeep,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 8,
                  gap: 4
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <CoinIcon size={16} />
                  <Text style={{ color: theme.colors.gold, fontWeight: "900" }}>{stats?.gold}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <XpIcon size={16} />
                  <Text style={{ color: theme.colors.xp, fontWeight: "900" }}>
                    {stats?.xp}/{stats?.nextLevelXp}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Panel>

        {activeTab === "quests" ? (
          <>
            <Panel title="Visão Geral">
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.panelDeep,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 12,
                    gap: 4
                  }}
                >
                  <Text style={{ fontSize: 18 }}>☀️</Text>
                  <Text style={{ color: theme.colors.warning, fontWeight: "900", fontSize: 18 }}>
                    {stats?.dailyCompletedCount ?? 0}/{stats?.dailyTotalCount ?? 0}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.panelDeep,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 12,
                    gap: 4
                  }}
                >
                  <Text style={{ fontSize: 18 }}>📅</Text>
                  <Text style={{ color: theme.colors.xp, fontWeight: "900", fontSize: 18 }}>
                    {stats?.weeklyCompletedCount ?? 0}/{stats?.weeklyTotalCount ?? 0}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.panelDeep,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 12,
                    gap: 4
                  }}
                >
                  <Text style={{ fontSize: 18 }}>✅</Text>
                  <Text style={{ color: theme.colors.success, fontWeight: "900", fontSize: 18 }}>{stats?.completionRate ?? 0}%</Text>
                </View>
              </View>
              <StreakCalendar reports={state.dailyReports} tasks={state.tasks} />
              {latestReport ? (
                <View
                  style={{
                    backgroundColor: theme.colors.panelDeep,
                    borderRadius: 12,
                    padding: 12,
                    gap: 6,
                    borderWidth: 1,
                    borderColor: theme.colors.border
                  }}
                >
                  <Text style={{ color: theme.colors.warning, fontWeight: "900" }}>📜 Relatório do cronista</Text>
                  <Text style={{ color: theme.colors.text }}>{latestReport.summary}</Text>
                </View>
              ) : (
                <Text style={{ color: theme.colors.muted }}>Nenhum relatório foi registrado até o momento.</Text>
              )}
            </Panel>

            <Panel title="Quests Diárias">
              {groupedTasks.daily.length ? (
                groupedTasks.daily.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => handleToggleTask(task.id, task.completed)}
                    onLongPress={() => openTaskActions(task)}
                  />
                ))
              ) : (
                <Text style={{ color: theme.colors.muted }}>Nenhuma quest diária cadastrada ainda.</Text>
              )}
            </Panel>

            <Panel title="Quests Semanais">
              {groupedTasks.weekly.length ? (
                groupedTasks.weekly.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => handleToggleTask(task.id, task.completed)}
                    onLongPress={() => openTaskActions(task)}
                  />
                ))
              ) : (
                <Text style={{ color: theme.colors.muted }}>Nenhuma quest semanal cadastrada ainda.</Text>
              )}
            </Panel>
          </>
        ) : null}

        {activeTab === "history" ? (
          <Panel title="Histórico">
            <HistoryPanel reports={state.dailyReports} entries={state.activityHistory} />
          </Panel>
        ) : null}

        {activeTab === "forge" ? (
          <>
            <Panel title={editingTask ? "Editar Quest" : "Criar Quest"}>
              <TaskCreator
                task={editingTask}
                onSubmit={handleTaskSubmit}
                onCancel={
                  editingTask
                    ? () => {
                        setEditingTask(undefined);
                        setActiveTab("quests");
                      }
                    : undefined
                }
              />
            </Panel>
          </>
        ) : null}

        {activeTab === "market" ? (
          <>
            <Panel title="Companheiros">
              <CompanionCollection
                gold={state.player.progress.gold}
                purchasedItemIds={purchasedItemIds}
                equippedCompanionId={state.shopUnlocks?.equippedCompanionId}
                selectedTheme={selectedCompanionTheme}
                selectedCompanionId={selectedCompanionId}
                onSelectTheme={setSelectedCompanionTheme}
                onSelectCompanion={setSelectedCompanionId}
                onBuy={buyShopItem}
                onEquip={setEquippedCompanion}
              />
            </Panel>
          </>
        ) : null}

        {activeTab === "settings" ? (
          <>
            <Panel title="Configurações">
              <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Preferências da jornada</Text>
              <Text style={{ color: theme.colors.muted }}>
                Esta área vai concentrar ajustes do aplicativo, notificações, aparência e gerenciamento do progresso.
              </Text>
              <View style={{ gap: 10 }}>
                <Pressable
                  onPress={() => setIsOnboardingPreviewOpen(true)}
                  style={{
                    backgroundColor: theme.colors.panelAlt,
                    borderColor: theme.colors.border,
                    borderWidth: 2,
                    borderRadius: theme.radius.md,
                    padding: theme.spacing.md
                  }}
                >
                  <Text style={{ color: theme.colors.text, textAlign: "center", fontWeight: "900" }}>Rever guia inicial</Text>
                </Pressable>
                <Pressable
                  onPress={() => void exportBackup()}
                  style={{
                    backgroundColor: theme.colors.panelAlt,
                    borderColor: theme.colors.border,
                    borderWidth: 2,
                    borderRadius: theme.radius.md,
                    padding: theme.spacing.md
                  }}
                >
                  <Text style={{ color: theme.colors.text, textAlign: "center", fontWeight: "900" }}>Exportar backup</Text>
                </Pressable>
              </View>
            </Panel>

            <Panel title="Perfil">
              <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{state.player.name}</Text>
              <Text style={{ color: theme.colors.muted }}>{classLabel}</Text>
              <Text style={{ color: theme.colors.muted }}>Nível atual: {stats?.level}</Text>
            </Panel>

            <Panel title="Jornada">
              <Text style={{ color: theme.colors.text }}>
                Use esta opção somente se quiser apagar o progresso atual e retornar para a escolha de classe.
              </Text>
              <Pressable
                onPress={confirmReset}
                style={{
                  backgroundColor: "#4a1f28",
                  borderColor: theme.colors.danger,
                  borderWidth: 2,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.md
                }}
              >
                <Text style={{ color: "#ffd7d9", textAlign: "center", fontWeight: "900" }}>
                  Resetar progresso
                </Text>
              </Pressable>
            </Panel>
          </>
        ) : null}
      </ScrollView>

      <View
          style={{
            position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 10,
          paddingBottom: 16,
          backgroundColor: "rgba(10, 15, 27, 0.92)",
          borderTopColor: theme.colors.border,
          borderTopWidth: 2
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setActiveTab("quests")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "quests" ? theme.colors.warning : theme.colors.panel,
              borderColor: activeTab === "quests" ? "#ffd68a" : theme.colors.border,
              borderWidth: 2,
              borderRadius: 12,
              paddingVertical: 10,
              alignItems: "center"
            }}
          >
            <Text style={{ color: activeTab === "quests" ? "#442707" : theme.colors.text, fontWeight: "900" }}>Tarefas</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("history")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "history" ? theme.colors.warning : theme.colors.panel,
              borderColor: activeTab === "history" ? "#ffd68a" : theme.colors.border,
              borderWidth: 2,
              borderRadius: 12,
              paddingVertical: 10,
              alignItems: "center"
            }}
          >
            <Text style={{ color: activeTab === "history" ? "#442707" : theme.colors.text, fontWeight: "900" }}>Histórico</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("forge")}
            style={{
              flex: 1,
              backgroundColor: activeTab === "forge" ? theme.colors.warning : theme.colors.panel,
              borderColor: activeTab === "forge" ? "#ffd68a" : theme.colors.border,
              borderWidth: 2,
              borderRadius: 12,
              paddingVertical: 10,
              alignItems: "center"
            }}
          >
            <Text style={{ color: activeTab === "forge" ? "#442707" : theme.colors.text, fontWeight: "900" }}>Criar</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
