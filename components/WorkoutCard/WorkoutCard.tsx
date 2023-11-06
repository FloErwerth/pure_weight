import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { useCallback, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IsoDate } from "../../types/date";
import { ProgressDisplay } from "./components/ProgressDisplay/ProgressDisplay";
import { Gesture, GestureDetector, GestureStateChangeEvent, GestureUpdateEvent, PanGestureChangeEventPayload, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { Animated, Pressable, View } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import { useTheme } from "../../theme/context";
import * as Haptics from "expo-haptics";

interface WorkoutCardProps {
  workoutName: string;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  overallTrainingData: { date?: IsoDate; diff?: { absolute: number; percent: string } };
  handleNavigateToProgress: () => void;
}

const DELETE_THRESHOLD = -60;
const EDIT_THRESHOLD = 60;

const useWorkoutGesturePan = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => {
  const gesture = useRef(Gesture.Pan()).current;
  const offsetX = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);
  const { secondaryBackgroundColor } = useTheme();
  const [isDelete, setIsDelete] = useState<boolean | undefined>(false);
  const handleGestureStart = useCallback(() => {
    setActive(true);
  }, []);

  const interpolatedBackgroundColor = useMemo(() => {
    if (isDelete) {
      return offsetX.interpolate({
        inputRange: [-60, -40, 0],
        outputRange: ["red", secondaryBackgroundColor, secondaryBackgroundColor],
      });
    } else {
      return offsetX.interpolate({
        inputRange: [0, 20, 40],
        outputRange: [secondaryBackgroundColor, "#114433", "#116633"],
      });
    }
  }, []);
  const handleGestureUpdate = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
      const translation = e.translationX;
      offsetX.setValue(translation);
      if (isDelete === undefined) {
        if (translation > 0) {
          setIsDelete(true);
        } else {
          setIsDelete(false);
        }
      }
    },
    [isDelete, offsetX],
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
      setIsDelete(undefined);
      setActive(false);
      Animated.timing(offsetX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    },
    [onEdit, onDelete, offsetX],
  );

  gesture.config = {
    maxPointers: 1,
    minPointers: 1,
    minDist: 20,
    userSelect: "none",
    needsPointerData: true,
  };

  gesture.onBegin(handleGestureStart);
  gesture.onChange(handleGestureUpdate);
  gesture.onEnd(handleGestureEnd);

  return [gesture, offsetX, active, interpolatedBackgroundColor] as const;
};

export const WorkoutCard = ({ handleNavigateToProgress, overallTrainingData, workoutName, onEdit, onDelete, onClick }: WorkoutCardProps) => {
  const [gesture, offsetX, active, interpolatedBackgroundColor] = useWorkoutGesturePan({ onEdit, onDelete });
  const { secondaryBackgroundColor, mainColor } = useTheme();
  const viewRef = useRef<View>(null);
  const [containerMeasures, setContainerMeasures] = useState<{ width: number; height: number }>({ width: 200, height: 120 });
  const containerMeasurement = useCallback(() => {
    viewRef.current?.measure((x, y, width, height) => {
      setContainerMeasures({ width, height: height - 10 });
    });
  }, []);

  const animatedWrapperStyles = useMemo(() => [styles.animatedWrapper, { transform: [{ translateX: offsetX }] }], [offsetX]);
  const wrapperStyles = useMemo(() => [styles.wrapper, { pointerEvents: active ? "none" : "auto" } as const], [active]);

  const iconContainerStyles = useMemo(
    () => [
      styles.iconContainer,
      {
        height: containerMeasures.height,
        right: 0,
        width: containerMeasures.width,
        backgroundColor: interpolatedBackgroundColor,
      },
    ],
    [containerMeasures, interpolatedBackgroundColor],
  );

  return (
    <GestureDetector gesture={gesture}>
      <Pressable onPress={onClick}>
        <View ref={viewRef} onLayout={containerMeasurement}>
          <Animated.View style={animatedWrapperStyles}>
            <ThemedView component style={wrapperStyles}>
              <Text style={styles.title}>{workoutName}</Text>
              <ProgressDisplay handleNavigateToProgress={handleNavigateToProgress} overallTrainingData={overallTrainingData} />
            </ThemedView>
          </Animated.View>
          <Animated.View style={iconContainerStyles}>
            <MaterialCommunityIcons style={styles.editIcon} color={mainColor} name="pencil" size={30} />
            <MaterialCommunityIcons style={styles.deleteIcon} color={mainColor} name="delete" size={32} />
          </Animated.View>
        </View>
      </Pressable>
    </GestureDetector>
  );
};
