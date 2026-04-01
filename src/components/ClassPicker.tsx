import { Pressable, Text, TextInput, View } from "react-native";
import { getCharacterClasses } from "@/domain/classes/registry";
import type { CharacterClassId } from "@/domain/types";
import { AnimatedCharacterSprite } from "@/components/pixel/AnimatedCharacterSprite";
import { SpriteFrame } from "@/components/pixel/SpriteFrame";
import { theme } from "@/theme";

export const ClassPicker = ({
  name,
  onChangeName,
  selectedClassId,
  onSelectClass,
  onConfirm
}: {
  name: string;
  onChangeName: (value: string) => void;
  selectedClassId: CharacterClassId;
  onSelectClass: (classId: CharacterClassId) => void;
  onConfirm: () => void;
}) => (
  <View style={{ gap: theme.spacing.md }}>
    <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: "900" }}>Escolha a sua classe</Text>
    <Text style={{ color: theme.colors.muted }}>
      O herói precisa nascer antes de aceitar quests. Cada classe pode receber sistemas novos sem quebrar o restante do jogo.
    </Text>
    <TextInput
      placeholder="Nome do herói"
      placeholderTextColor="#7c97ae"
      value={name}
      onChangeText={onChangeName}
      style={{
        backgroundColor: theme.colors.panel,
        color: theme.colors.text,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md
      }}
    />
    {getCharacterClasses().map((item) => {
      const selected = item.id === selectedClassId;

      return (
        <Pressable
          key={item.id}
          onPress={() => onSelectClass(item.id)}
          style={{
            flexDirection: "row",
            gap: theme.spacing.md,
            alignItems: "center",
            backgroundColor: selected ? theme.colors.panelAlt : theme.colors.panel,
            borderColor: selected ? item.accentColor : theme.colors.border,
            borderWidth: 2,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md
          }}
        >
          <SpriteFrame>
            <AnimatedCharacterSprite classId={item.id} pixelSize={4} amplitude={selected ? 3 : 1} duration={selected ? 1200 : 2200} />
          </SpriteFrame>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}>{item.name}</Text>
            <Text style={{ color: theme.colors.muted }}>{item.lore}</Text>
            <Text style={{ color: item.accentColor }}>{item.startMessage}</Text>
          </View>
        </Pressable>
      );
    })}
    <Pressable
      onPress={onConfirm}
      style={{
        backgroundColor: theme.colors.gold,
        borderRadius: theme.radius.sm,
        paddingVertical: 14,
        alignItems: "center"
      }}
    >
      <Text style={{ color: "#3b2504", fontWeight: "900", fontSize: 16 }}>Iniciar jornada</Text>
    </Pressable>
  </View>
);
