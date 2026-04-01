import { View } from "react-native";
import { theme } from "@/theme";

export const SpriteFrame = ({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "banner";
}) => (
  <View
    style={{
      backgroundColor: "#132238",
      borderColor: theme.colors.border,
      borderWidth: 2,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 6,
      alignItems: "center"
    }}
  >
    {children}
  </View>
);
