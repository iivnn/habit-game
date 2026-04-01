import { Text, View } from "react-native";
import type { DailyReport, TaskHistoryEntry } from "@/domain/types";
import { theme } from "@/theme";

const formatHistoryDate = (isoDate: string) =>
  new Date(`${isoDate}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  });

const formatHistoryTimestamp = (isoDateTime: string) =>
  new Date(isoDateTime).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });

export const HistoryPanel = ({
  reports,
  entries
}: {
  reports: DailyReport[];
  entries: TaskHistoryEntry[];
}) => {
  const recentReports = reports.slice(0, 7);
  const currentStreak = (() => {
    let streak = 0;

    for (const report of recentReports) {
      if (report.totalCount > 0 && report.completionRate === 100) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  })();

  const groupedEntries = entries.slice(0, 20).reduce<Record<string, TaskHistoryEntry[]>>((accumulator, entry) => {
    const dateKey = entry.completedAt.slice(0, 10);

    if (!accumulator[dateKey]) {
      accumulator[dateKey] = [];
    }

    accumulator[dateKey].push(entry);
    return accumulator;
  }, {});

  const historyDays = Object.entries(groupedEntries);

  return (
    <View style={{ gap: 12 }}>
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
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Sequência perfeita</Text>
          <Text style={{ color: theme.colors.warning, fontSize: 22, fontWeight: "900" }}>{currentStreak} dia(s)</Text>
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
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Registros recentes</Text>
          <Text style={{ color: theme.colors.xp, fontSize: 22, fontWeight: "900" }}>{entries.length}</Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>Últimos dias</Text>
        {recentReports.length ? (
          recentReports.map((report) => (
            <View
              key={report.id}
              style={{
                backgroundColor: theme.colors.panelDeep,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                gap: 4
              }}
            >
              <Text style={{ color: theme.colors.text, fontWeight: "900" }}>
                {formatHistoryDate(report.date)} - {report.completedCount}/{report.totalCount}
              </Text>
              <Text style={{ color: report.completionRate === 100 ? theme.colors.success : theme.colors.muted }}>
                {report.completionRate}% concluído
              </Text>
              <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{report.summary}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: theme.colors.muted }}>O histórico vai aparecer depois que os primeiros dias forem registrados.</Text>
        )}
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>Tarefas concluídas</Text>
        {historyDays.length ? (
          historyDays.map(([date, dayEntries]) => (
            <View
              key={date}
              style={{
                backgroundColor: theme.colors.panelDeep,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                gap: 8
              }}
            >
              <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{formatHistoryDate(date)}</Text>
              {dayEntries.map((entry) => (
                <View key={entry.id} style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                  <Text style={{ color: theme.colors.text, flex: 1 }}>
                    {entry.taskIcon ? `${entry.taskIcon} ` : ""}
                    {entry.taskTitle}
                  </Text>
                  <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                    {formatHistoryTimestamp(entry.completedAt)}  +{entry.reward.xp} xp  +{entry.reward.gold} gold
                  </Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={{ color: theme.colors.muted }}>Nenhuma tarefa concluída foi registrada ainda.</Text>
        )}
      </View>
    </View>
  );
};
