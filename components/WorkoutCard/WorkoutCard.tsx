import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IsoDate } from "../../types/date";
import { ProgressDisplay } from "./components/ProgressDisplay/ProgressDisplay";
import { Gesture, GestureDetector, GestureStateChangeEvent, GestureUpdateEvent, PanGestureChangeEventPayload, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { Animated, Dimensions, Pressable, View } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import { useTheme } from "../../theme/context";
import * as Haptics from "expo-haptics";
import { useAppSelector } from "../../store";
import { getThemeKey } from "../../store/selectors";

interface WorkoutCardProps {
  workoutName: string;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  overallTrainingData: { date?: IsoDate; diff?: { absolute: number; percent: string } };
  handleNavigateToProgress: () => void;
}

const HALF_SCREEN = Dimensions.get("screen").width / 2;
const DELETE_THRESHOLD = -60;
const EDIT_THRESHOLD = 60;
const BACKGROUND_INPUT = [DELETE_THRESHOLD - 5, DELETE_THRESHOLD, -1, 0, 1, EDIT_THRESHOLD, EDIT_THRESHOLD + 5];
const LIGHT_BACKGROUND_OUTPUT = ["#ff1111", "#aa1111", "#aa1111", "white", "#113311", "#11aa11", "#11cc11"];
const DARK_BACKGROUND_OUTPUT = ["#991111", "#331111", "#331111", "black", "#115511", "#115511", "#118811"];
const POSITION_RANGE = [-250, -100, 0, 100, 250];
const POSITION_OUTPUT = [HALF_SCREEN - 50, 0, 0, 0, -HALF_SCREEN + 50];
const useWorkoutGesturePan = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => {
  const gesture = useRef(Gesture.Pan()).current;

  useEffect(() => {
    gesture.config = {
      maxPointers: 1,
      minPointers: 1,
      minDist: 10,
      userSelect: "none",
    };
  }, [gesture]);

  const offsetX = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);
  const theme = useAppSelector(getThemeKey);

  const handleGestureStart = useCallback(() => {
    setActive(true);
  }, []);

  const outputRange = useMemo(() => {
    if (theme === "dark") {
      return DARK_BACKGROUND_OUTPUT;
    } else {
      return LIGHT_BACKGROUND_OUTPUT;
    }
  }, [theme]);

  const interpolatedBackgroundColor = useMemo(
    () =>
      offsetX.interpolate({
        inputRange: BACKGROUND_INPUT,
        outputRange: outputRange,
        extrapolate: "clamp",
      }),
    [offsetX, outputRange],
  );

  const handleGestureUpdate = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
      const translation = e.translationX;
      offsetX.setValue(translation);
    },
    [offsetX],
  );

  const handleGestureEnd = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      const translation = e.translationX;
      if (translation > 0) {
        if (translation > EDIT_THRESHOLD) {
          onEdit();
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else {
        if (translation < DELETE_THRESHOLD) {
          onDelete();
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
      Animated.timing(offsetX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setActive(false);
    },
    [onEdit, onDelete, offsetX],
  );

  gesture.onBegin(handleGestureStart);
  gesture.onChange(handleGestureUpdate);
  gesture.onEnd(handleGestureEnd);

  return [gesture, offsetX, active, interpolatedBackgroundColor] as const;
};

export const WorkoutCard = ({ handleNavigateToProgress, overallTrainingData, workoutName, onEdit, onDelete, onClick }: WorkoutCardProps) => {
  const [gesture, offsetX, active, interpolatedBackgroundColor] = useWorkoutGesturePan({ onEdit, onDelete });
  const viewRef = useRef<View>(null);
  const { mainColor } = useTheme();
  const [containerMeasures, setContainerMeasures] = useState<{ width: number; height: number }>({ width: 200, height: 120 });
  const theme = useAppSelector(getThemeKey);
  const computedColor = theme === "dark" ? mainColor : "white";

  const containerMeasurement = useCallback(() => {
    viewRef.current?.measure((x, y, width, height) => {
      setContainerMeasures({ width, height: height - 10 });
    });
  }, []);

  const interpolatedIconPosition = useMemo(() => {
    return offsetX.interpolate({
      inputRange: POSITION_RANGE,
      outputRange: POSITION_OUTPUT,
      extrapolate: "clamp",
    });
  }, [offsetX]);

  const animatedWrapperStyles = useMemo(() => [styles.animatedWrapper, { transform: [{ translateX: offsetX }] }], [offsetX]);

  const outerIconWrapperStyles = useMemo(
    () => [
      styles.iconContainer,
      {
        height: containerMeasures.height,
        width: containerMeasures.width,
        backgroundColor: interpolatedBackgroundColor,
      },
    ],
    [containerMeasures, interpolatedBackgroundColor],
  );

  const innerIconWrapperStyles = useMemo(
    () => [
      styles.innerIconContainer,
      {
        height: containerMeasures.height,
        right: interpolatedIconPosition,
      },
    ],
    [containerMeasures.height, interpolatedIconPosition],
  );

  return (
    <GestureDetector gesture={gesture}>
      <Pressable disabled={active} onPress={onClick}>
        <View ref={viewRef} onLayout={containerMeasurement}>
          <Animated.View style={animatedWrapperStyles}>
            <ThemedView component style={styles.wrapper}>
              <Text style={styles.title}>{workoutName}</Text>
              <ProgressDisplay handleNavigateToProgress={handleNavigateToProgress} overallTrainingData={overallTrainingData} />
            </ThemedView>
          </Animated.View>
          <Animated.View style={outerIconWrapperStyles}>
            <Animated.View style={innerIconWrapperStyles}>
              <MaterialCommunityIcons style={styles.editIcon} color={computedColor} name="pencil" size={30} />
              <MaterialCommunityIcons style={styles.deleteIcon} color={computedColor} name="delete" size={32} />
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </GestureDetector>
  );
};
