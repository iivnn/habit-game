import { Modal, Pressable, Text, View } from "react-native";
import { theme } from "@/theme";

const onboardingSteps = [
  {
    icon: "🧙",
    title: "Escolha sua classe",
    body: "Seu herói define a identidade da jornada. O visual já aparece na tela principal."
  },
  {
    icon: "📝",
    title: "Crie suas quests",
    body: "Cadastre tarefas diárias ou semanais, ajuste dias ativos, horário e recompensas."
  },
  {
    icon: "⚔️",
    title: "Conclua e evolua",
    body: "Cada tarefa concluída rende xp e gold para subir de nível e fortalecer a rotina."
  },
  {
    icon: "🐾",
    title: "Gaste seu gold",
    body: "Abra a loja pelo ouro do topo e desbloqueie companheiros para te acompanhar."
  }
];

export const OnboardingModal = ({
  visible,
  onClose
}: {
  visible: boolean;
  onClose: () => void;
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(5, 10, 18, 0.76)",
        justifyContent: "center",
        padding: theme.spacing.lg
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
          borderWidth: 2,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
          gap: 14
        }}
      >
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900" }}>Boas-vindas ao reino</Text>
        <Text style={{ color: theme.colors.muted }}>
          Esta primeira versão já cobre o ciclo principal do app. Aqui vai um guia rápido para não se perder.
        </Text>

        {onboardingSteps.map((step) => (
          <View key={step.title} style={{ flexDirection: "row", gap: 12 }}>
            <Text style={{ fontSize: 22 }}>{step.icon}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{step.title}</Text>
              <Text style={{ color: theme.colors.muted }}>{step.body}</Text>
            </View>
          </View>
        ))}

        <Pressable
          onPress={onClose}
          style={{
            backgroundColor: theme.colors.success,
            borderColor: "#bff0c9",
            borderWidth: 2,
            borderRadius: theme.radius.md,
            paddingVertical: 12,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#102317", fontWeight: "900", fontSize: 16 }}>Entendi</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);
