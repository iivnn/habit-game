import { Image } from "react-native";
import type { CharacterClassId } from "@/domain/types";
import { PixelSprite } from "@/components/pixel/PixelSprite";
import { classSprites } from "@/components/pixel/classSprites";

const rasterClassSprites: Partial<Record<CharacterClassId, number>> = {
  warrior: require("../../../assets/warrior.png"),
  archer: require("../../../assets/archer.png"),
  mage: require("../../../assets/mage.png"),
  rogue: require("../../../assets/ladin.png"),
  cleric: require("../../../assets/clrerig.png"),
  sorcerer: require("../../../assets/witch.png"),
  knight: require("../../../assets/knight.png")
};

export const CharacterSprite = ({
  classId,
  pixelSize = 8
}: {
  classId: CharacterClassId;
  pixelSize?: number;
}) => {
  const rasterSprite = rasterClassSprites[classId];

  if (rasterSprite) {
    const dimension = pixelSize * 20;

    return (
      <Image
        source={rasterSprite}
        style={{
          width: dimension,
          height: dimension
        }}
        resizeMode="contain"
      />
    );
  }

  return <PixelSprite matrix={classSprites[classId].matrix} palette={classSprites[classId].palette} pixelSize={pixelSize} />;
};
