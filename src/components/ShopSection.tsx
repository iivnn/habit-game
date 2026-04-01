import { Pressable, Text, View } from "react-native";
import type { ShopCategory, ShopItemId } from "@/domain/types";
import { getShopItemsByCategory } from "@/domain/shop/catalog";
import { CoinIcon } from "@/components/HeaderIcons";
import { theme } from "@/theme";

const sectionMeta: Record<ShopCategory, { title: string; subtitle: string }> = {
  hero: {
    title: "Visual do Heroi",
    subtitle: "Capas, molduras e equipamentos para reforcar a identidade do aventureiro."
  },
  village: {
    title: "Restauracao da Vila",
    subtitle: "Cada compra reconstrói um pouco mais o reino ao redor do personagem."
  },
  companion: {
    title: "Companheiros",
    subtitle: "Criaturas e mascotes para acompanhar sua jornada."
  }
};

export const ShopSection = ({
  category,
  gold,
  purchasedItemIds,
  onBuy
}: {
  category: ShopCategory;
  gold: number;
  purchasedItemIds: ShopItemId[];
  onBuy: (itemId: ShopItemId) => void;
}) => {
  const meta = sectionMeta[category];
  const items = getShopItemsByCategory(category);

  return (
    <View style={{ gap: 10 }}>
      <View style={{ gap: 2 }}>
        <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "900" }}>{meta.title}</Text>
        <Text style={{ color: theme.colors.muted }}>{meta.subtitle}</Text>
      </View>

      {items.map((item) => {
        const purchased = purchasedItemIds.includes(item.id);
        const canAfford = gold >= item.cost;

        return (
          <View
            key={item.id}
            style={{
              backgroundColor: theme.colors.panelDeep,
              borderColor: purchased ? theme.colors.success : theme.colors.border,
              borderWidth: 2,
              borderRadius: 14,
              padding: 12,
              gap: 10
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
              <View style={{ flexDirection: "row", gap: 10, flex: 1 }}>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#102036",
                    borderWidth: 1,
                    borderColor: theme.colors.border
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{item.title}</Text>
                  <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{item.subtitle} • {item.rarityLabel}</Text>
                  <Text style={{ color: theme.colors.muted }}>{item.flavor}</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <CoinIcon size={16} />
                <Text style={{ color: theme.colors.gold, fontWeight: "900" }}>{item.cost}</Text>
              </View>

              <Pressable
                disabled={purchased || !canAfford}
                onPress={() => onBuy(item.id)}
                style={{
                  backgroundColor: purchased ? "#375345" : canAfford ? theme.colors.warning : "#4a5261",
                  borderColor: purchased ? "#8bd49a" : canAfford ? "#ffd68a" : "#7d8798",
                  borderWidth: 2,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 8
                }}
              >
                <Text style={{ color: purchased ? "#d8ffe0" : canAfford ? "#442707" : "#d5d9e0", fontWeight: "900" }}>
                  {purchased ? "Desbloqueado" : canAfford ? "Comprar" : "Sem gold"}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};
