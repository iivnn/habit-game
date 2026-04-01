import { View } from "react-native";

interface PixelSpriteProps {
  matrix: string[];
  palette: Record<string, string>;
  pixelSize?: number;
}

export const PixelSprite = ({ matrix, palette, pixelSize = 6 }: PixelSpriteProps) => (
  <View style={{ gap: 0 }}>
    {matrix.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={{ flexDirection: "row" }}>
        {row.split("").map((pixel, columnIndex) => (
          <View
            key={`pixel-${rowIndex}-${columnIndex}`}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: pixel === "." ? "transparent" : palette[pixel] ?? "transparent"
            }}
          />
        ))}
      </View>
    ))}
  </View>
);
