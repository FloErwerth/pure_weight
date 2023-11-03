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

  const handleGestureUpdate = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
      const translation = e.translationX;
      if (translation > 0) {
        if (translation < EDIT_THRESHOLD) {
          offsetX.setValue(translation);
        }
      } else {
        if (translation > DELETE_THRESHOLD) {
          offsetX.setValue(translation);
        }
      }
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
        duration: 100,
        useNativeDriver: false,
      }).start();
    },
    [onEdit, onDelete, offsetX],
  );

  gesture.config = {
    maxPointers: 1,
    minPointers: 1,
    userSelect: "none",
    needsPointerData: true,
  };
  gesture.onChange(handleGestureUpdate);
  gesture.onEnd(handleGestureEnd);

  return [gesture, offsetX] as const;
};

export const WorkoutCard = ({ handleNavigateToProgress, overallTrainingData, workoutName, onEdit, onDelete, onClick }: WorkoutCardProps) => {
  const [gesture, offsetX] = useWorkoutGesturePan({ onEdit, onDelete });
  const { secondaryBackgroundColor, mainColor } = useTheme();
  const viewRef = useRef<View>(null);
  const [containerHeight, setContainerHeight] = useState(120);
  const containerMeasurement = useCallback(() => {
    viewRef.current?.measure((x, y, width, height) => {
      setContainerHeight(height - 10);
    });
  }, []);

  const wrapperStyles = useMemo(() => [styles.animatedWrapper, { transform: [{ translateX: offsetX }] }], [offsetX]);
  const editContainerStyles = useMemo(
    () => [
      styles.iconContainer,
      {
        left: 0,
        height: containerHeight,
        backgroundColor: offsetX.interpolate({
          inputRange: [0, 20, 60],
          outputRange: [secondaryBackgroundColor, secondaryBackgroundColor, "#116633"],
        }),
      },
    ],
    [containerHeight, offsetX, secondaryBackgroundColor],
  );

  const deleteContainerStyles = useMemo(
    () => [
      styles.iconContainer,
      {
        height: containerHeight,
        right: 0,
        backgroundColor: offsetX.interpolate({
          inputRange: [-60, -20, 0],
          outputRange: ["red", secondaryBackgroundColor, secondaryBackgroundColor],
        }),
      },
    ],
    [containerHeight, offsetX, secondaryBackgroundColor],
  );

  return (
    <GestureDetector gesture={gesture}>
      <Pressable onPress={onClick}>
        <View ref={viewRef} onLayout={containerMeasurement}>
          <Animated.View style={wrapperStyles}>
            <ThemedView component style={styles.wrapper}>
              <Text style={styles.title}>{workoutName}</Text>
              <ProgressDisplay handleNavigateToProgress={handleNavigateToProgress} overallTrainingData={overallTrainingData} />
            </ThemedView>
          </Animated.View>
          <Animated.View style={editContainerStyles}>
            <MaterialCommunityIcons style={styles.editIcon} color={mainColor} name="pencil" size={30} />
          </Animated.View>
          <Animated.View style={deleteContainerStyles}>
            <MaterialCommunityIcons style={styles.deleteIcon} color={mainColor} name="delete" size={32} />
          </Animated.View>
        </View>
      </Pressable>
    </GestureDetector>
  );
};
