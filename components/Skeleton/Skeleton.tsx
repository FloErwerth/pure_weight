import { Animated, View, ViewProps } from "react-native";
import { useEffect, useMemo, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
import { useTheme } from "../../theme/context";

interface SkeletonProps {
  width: number;
  height: number;
  borderRadius?: number;
  shape?: "rect" | "circle";
  style?: ViewProps["style"];
}
export const Skeleton = ({ width, height, shape = "rect", style, borderRadius }: SkeletonProps) => {
  const fadeAnim = useRef(new Animated.Value(-width * 2)).current;
  const { componentBackgroundColor } = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: width * 2,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [fadeAnim, width]);

  const wrapperStyle = useMemo(() => [style, { ...styles.wrapper, width, height, borderRadius: shape === "circle" ? width : borderRadius }], [borderRadius, height, shape, style, width]);
  const transformStyle = useMemo(() => [{ translateX: fadeAnim }], [fadeAnim]);
  return (
    <View style={wrapperStyle}>
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: transformStyle,
        }}
      >
        <LinearGradient style={styles.gradient} start={{ x: 1, y: 1 }} colors={[componentBackgroundColor, "#777", componentBackgroundColor]} />
      </Animated.View>
    </View>
  );
};
