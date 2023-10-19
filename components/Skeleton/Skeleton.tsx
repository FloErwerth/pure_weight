import { Animated, LayoutAnimation, View, ViewProps } from "react-native";
import { useEffect, useLayoutEffect, useRef } from "react";
import { componentBackgroundColor } from "../App/theme/colors";
import { LinearGradient } from "expo-linear-gradient";

interface SkeletonProps {
  width: number;
  height: number;
  borderRadius?: number;
  shape?: "rect" | "circle";
  style?: ViewProps["style"];
}
export const Skeleton = ({ width, height, shape = "rect", style, borderRadius }: SkeletonProps) => {
  const fadeAnim = useRef(new Animated.Value(-width * 2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: width * 2,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [fadeAnim, width]);

  useLayoutEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  return (
    <View style={[style, { backgroundColor: componentBackgroundColor, width, height, overflow: "hidden", borderRadius: shape === "circle" ? width : borderRadius }]}>
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateX: fadeAnim }],
        }}
      >
        <LinearGradient style={{ width: "200%", height: "200%" }} start={{ x: 1, y: 1 }} colors={[componentBackgroundColor, "#777", componentBackgroundColor]} />
      </Animated.View>
    </View>
  );
};
