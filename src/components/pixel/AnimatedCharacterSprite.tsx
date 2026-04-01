import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import type { CharacterClassId } from "@/domain/types";
import { CharacterSprite } from "@/components/pixel/CharacterSprite";

export const AnimatedCharacterSprite = ({
  classId,
  pixelSize = 8,
  amplitude = 4,
  duration = 1700
}: {
  classId: CharacterClassId;
  pixelSize?: number;
  amplitude?: number;
  duration?: number;
}) => {
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -amplitude,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [amplitude, duration, floatY]);

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }] }}>
      <CharacterSprite classId={classId} pixelSize={pixelSize} />
    </Animated.View>
  );
};
