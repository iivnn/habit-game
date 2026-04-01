import Svg, { Circle, Path, Rect } from "react-native-svg";

export const HabitQuestIcon = ({ size = 42 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path d="M14 10 L24 22" stroke="#8d6a45" strokeWidth="5" strokeLinecap="round" />
    <Path d="M50 10 L40 22" stroke="#7f8fa1" strokeWidth="5" strokeLinecap="round" />
    <Path d="M10 16 L22 28" stroke="#c6d4df" strokeWidth="3" strokeLinecap="round" />
    <Path d="M54 16 L42 28" stroke="#c6d4df" strokeWidth="3" strokeLinecap="round" />
    <Path d="M22 14 L32 6 L42 14 L42 30 C42 40 37 48 32 52 C27 48 22 40 22 30 Z" fill="#28476f" stroke="#d8b96a" strokeWidth="3" />
    <Path d="M32 15 L35 21 L42 22 L37 27 L38 34 L32 31 L26 34 L27 27 L22 22 L29 21 Z" fill="#f3d36f" />
    <Rect x="28" y="39" width="8" height="10" rx="2" fill="#9ed58f" stroke="#203220" strokeWidth="2" />
    <Path d="M32 28 V39" stroke="#203220" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M25 42 H39" stroke="#203220" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="32" cy="44" r="1.6" fill="#203220" />
  </Svg>
);

export const CoinIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" fill="#f5c95b" stroke="#8b5f16" strokeWidth="2" />
    <Circle cx="12" cy="12" r="5.5" fill="#f8df87" opacity="0.85" />
    <Path d="M12 7.5 V16.5" stroke="#8b5f16" strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 10 C9.4 8.8 10.4 8 12 8 C13.7 8 14.9 8.8 15 10 C15.1 11.3 13.8 11.8 12 12.2 C10.2 12.6 8.9 13.2 9 14.6 C9.1 15.9 10.4 16.6 12.1 16.6 C13.7 16.6 14.8 15.8 15.2 14.7" stroke="#8b5f16" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </Svg>
);

export const XpIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" fill="#79d5ff" stroke="#1e607b" strokeWidth="2" />
    <Path d="M12 5 L13.8 10.1 L19 12 L13.8 13.9 L12 19 L10.2 13.9 L5 12 L10.2 10.1 Z" fill="#dff8ff" />
  </Svg>
);

export const HourglassIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M7 4 H17" stroke="#d5e5f2" strokeWidth="2" strokeLinecap="round" />
    <Path d="M7 20 H17" stroke="#d5e5f2" strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 4 C8 8, 11 9, 12 10 C13 9, 16 8, 16 4" stroke="#d5e5f2" strokeWidth="2" fill="none" />
    <Path d="M8 20 C8 16, 11 15, 12 14 C13 15, 16 16, 16 20" stroke="#d5e5f2" strokeWidth="2" fill="none" />
    <Path d="M10 7 H14" stroke="#79d5ff" strokeWidth="2" strokeLinecap="round" />
    <Path d="M10 17 H14" stroke="#f5c95b" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ClockIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" fill="#d5e5f2" stroke="#4b6d88" strokeWidth="2" />
    <Path d="M12 7 V12 L15.5 14" stroke="#315067" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const GearIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 3.5 L13.6 5.1 L15.9 4.7 L16.7 6.9 L18.9 7.7 L18.5 10 L20.1 11.6 L18.5 13.2 L18.9 15.5 L16.7 16.3 L15.9 18.5 L13.6 18.1 L12 19.7 L10.4 18.1 L8.1 18.5 L7.3 16.3 L5.1 15.5 L5.5 13.2 L3.9 11.6 L5.5 10 L5.1 7.7 L7.3 6.9 L8.1 4.7 L10.4 5.1 Z"
      fill="#d7e3ef"
      stroke="#49637c"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="11.6" r="3.1" fill="#7ea7c7" stroke="#35516a" strokeWidth="1.5" />
  </Svg>
);
