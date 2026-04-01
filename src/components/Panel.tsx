import type { ReactNode } from "react";
import { View, Text } from "react-native";
import { theme } from "@/theme";

export const Panel = ({ title, children }: { title?: string; children: ReactNode }) => (
  <View
    style={{
      backgroundColor: theme.colors.panelEdge,
      borderColor: "#08111d",
      borderWidth: 2,
      borderRadius: theme.radius.md + 2,
      padding: 4
    }}
  >
    <View
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.border,
        borderWidth: 2,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        gap: theme.spacing.sm
      }}
    >
      {title ? (
        <View
          style={{
            backgroundColor: theme.colors.panelDeep,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 8,
            alignSelf: "flex-start"
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 17, fontWeight: "900" }}>{title}</Text>
        </View>
      ) : null}
      {children}
    </View>
  </View>
);
