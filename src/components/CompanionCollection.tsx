import { ScrollView, Pressable, Text, View } from "react-native";
import type { ShopItemId } from "@/domain/types";
import { getCompanionThemes, getShopItem, getShopItemsByCategory } from "@/domain/shop/catalog";
import { CoinIcon } from "@/components/HeaderIcons";
import { theme } from "@/theme";

const allCompanions = getShopItemsByCategory("companion");

export const CompanionCollection = ({
  gold,
  purchasedItemIds,
  equippedCompanionId,
  selectedTheme,
  selectedCompanionId,
  onSelectTheme,
  onSelectCompanion,
  onBuy,
  onEquip
}: {
  gold: number;
  purchasedItemIds: ShopItemId[];
  equippedCompanionId?: ShopItemId;
  selectedTheme: string;
  selectedCompanionId?: ShopItemId;
  onSelectTheme: (theme: string) => void;
  onSelectCompanion: (itemId: ShopItemId) => void;
  onBuy: (itemId: ShopItemId) => void;
  onEquip: (itemId: ShopItemId) => void;
}) => {
  const themes = getCompanionThemes();
  const companions = allCompanions.filter((item) => item.theme === selectedTheme);
  const selectedCompanion =
    companions.find((item) => item.id === selectedCompanionId) ??
    getShopItem(equippedCompanionId ?? "") ??
    companions[0] ??
    allCompanions[0];
  const selectedPurchased = selectedCompanion ? purchasedItemIds.includes(selectedCompanion.id) : false;
  const selectedEquipped = selectedCompanion?.id === equippedCompanionId;
  const canAffordSelected = selectedCompanion ? gold >= selectedCompanion.cost : false;

  const getStatusBadge = (purchased: boolean, equipped: boolean) => {
    if (equipped) {
      return {
        icon: "✓",
        backgroundColor: "#1e5a39",
        borderColor: "#8ad29b",
        color: "#e8fff0"
      };
    }

    if (purchased) {
      return {
        icon: "🔓",
        backgroundColor: "#3a2d14",
        borderColor: "#d6b36b",
        color: "#fff0c8"
      };
    }

    return {
      icon: "🔒",
      backgroundColor: "#2b3443",
      borderColor: "#7a8798",
      color: "#d5d9e0"
    };
  };

  return (
    <View style={{ gap: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {themes.map((themeName) => {
          const active = themeName === selectedTheme;
          return (
            <Pressable
              key={themeName}
              onPress={() => onSelectTheme(themeName)}
              style={{
                backgroundColor: active ? theme.colors.warning : theme.colors.panelDeep,
                borderColor: active ? "#ffd68a" : theme.colors.border,
                borderWidth: 2,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 8
              }}
            >
              <Text style={{ color: active ? "#442707" : theme.colors.text, fontWeight: "900" }}>{themeName}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {selectedCompanion ? (
        <View
          style={{
            backgroundColor: theme.colors.panelDeep,
            borderColor: theme.colors.border,
            borderWidth: 2,
            borderRadius: 16,
            padding: 14,
            gap: 10
          }}
        >
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#102036",
                borderWidth: 2,
                borderColor: theme.colors.border
              }}
            >
              <Text style={{ fontSize: 34 }}>{selectedCompanion.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "900" }}>{selectedCompanion.title}</Text>
              <Text style={{ color: theme.colors.muted }}>{selectedCompanion.flavor}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <CoinIcon size={16} />
                <Text style={{ color: theme.colors.gold, fontWeight: "900" }}>1000</Text>
              </View>
            </View>
          </View>

          <Pressable
            disabled={selectedEquipped || (!selectedPurchased && !canAffordSelected)}
            onPress={() =>
              selectedPurchased ? onEquip(selectedCompanion.id) : onBuy(selectedCompanion.id)
            }
            style={{
              backgroundColor: selectedEquipped ? "#385546" : selectedPurchased ? theme.colors.success : canAffordSelected ? theme.colors.warning : "#4d5563",
              borderColor: selectedEquipped ? "#8ad29b" : selectedPurchased ? "#bff0c9" : canAffordSelected ? "#ffd68a" : "#7a8798",
              borderWidth: 2,
              borderRadius: 12,
              paddingVertical: 10,
              alignItems: "center"
            }}
          >
            <Text style={{ color: selectedEquipped ? "#dfffea" : selectedPurchased ? "#102317" : canAffordSelected ? "#442707" : "#d5d9e0", fontWeight: "900" }}>
              {selectedEquipped ? "Em uso" : selectedPurchased ? "Equipar" : "Comprar por 1000"}
            </Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {companions.map((item) => {
          const purchased = purchasedItemIds.includes(item.id);
          const equipped = item.id === equippedCompanionId;
          const badge = getStatusBadge(purchased, equipped);

          return (
            <Pressable
              key={item.id}
              onPress={() => {
                onSelectTheme(item.theme ?? selectedTheme);
                onSelectCompanion(item.id);
              }}
              style={{
                width: 94,
                backgroundColor: theme.colors.panelDeep,
                borderColor: theme.colors.border,
                borderWidth: 2,
                borderRadius: 14,
                padding: 10,
                alignItems: "center",
                gap: 6,
                position: "relative"
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: badge.backgroundColor,
                  borderWidth: 1.5,
                  borderColor: badge.borderColor,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ color: badge.color, fontSize: equipped ? 12 : 11, fontWeight: "900" }}>{badge.icon}</Text>
              </View>
              <Text style={{ fontSize: 26 }}>{item.icon}</Text>
              <Text numberOfLines={2} style={{ color: theme.colors.text, fontSize: 11, fontWeight: "900", textAlign: "center" }}>
                {item.title}
              </Text>
              <Text style={{ color: theme.colors.gold, fontSize: 10, fontWeight: "900" }}>
                1000
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
