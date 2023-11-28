import { styles } from "./styles";
import { createContext, PropsWithChildren, useCallback, useMemo, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Gesture,
    GestureDetector,
    GestureStateChangeEvent,
    GestureUpdateEvent,
    PanGestureChangeEventPayload,
    PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Animated, Dimensions, Pressable, View } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import { useTheme } from "../../theme/context";
import * as Haptics from "expo-haptics";
import { useAppSelector } from "../../store";
import ReAnimated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

import { getThemeKey } from "../../store/reducers/settings/settingsSelectors";

interface SwipeableProps extends PropsWithChildren {
    onClick: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const HALF_SCREEN = Dimensions.get("screen").width / 2;
const DELETE_THRESHOLD = -60;
const EDIT_THRESHOLD = 60;
const BACKGROUND_INPUT = [DELETE_THRESHOLD - 5, DELETE_THRESHOLD, -1, 0, 1, EDIT_THRESHOLD, EDIT_THRESHOLD + 5];
const LIGHT_BACKGROUND_OUTPUT = ["#ff1111", "#aa1111", "#aa1111", "transparent", "#113311", "#11aa11", "#11cc11"];
const DARK_BACKGROUND_OUTPUT = ["#991111", "#331111", "#331111", "transparent", "#115511", "#115511", "#118811"];
const POSITION_RANGE = [-250, -100, 0, 100, 250];
const POSITION_OUTPUT = [HALF_SCREEN - 50, 0, 0, 0, -HALF_SCREEN + 50];
const useWorkoutGesturePan = ({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) => {
    const gesture = useRef(Gesture.Pan()).current;
    const [active, setActive] = useState(false);

    gesture.config = {
        maxPointers: 1,
        minPointers: 1,
        minDist: 30,
    };

    const offsetX = useRef(new Animated.Value(0)).current;
    const theme = useAppSelector(getThemeKey);

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
            if (!active) {
                setActive(true);
            }
            const translation = e.translationX;
            if (onEdit && translation > 0) {
                offsetX.setValue(translation);
            }
            if (onDelete && translation < 0) {
                offsetX.setValue(translation);
            }
        },
        [active, offsetX, onDelete, onEdit],
    );

    const handleGestureEnd = useCallback(
        (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
            const translation = e.translationX;
            if (translation > 0) {
                if (onEdit && translation > EDIT_THRESHOLD) {
                    Animated.timing(offsetX, {
                        toValue: 500,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        Animated.timing(offsetX, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: false,
                        }).start(() => setActive(false));
                    });
                    setTimeout(() => onEdit(), 200);
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                } else {
                    Animated.timing(offsetX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => setActive(false));
                }
            } else {
                if (onDelete && translation < DELETE_THRESHOLD) {
                    Animated.timing(offsetX, {
                        toValue: -500,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        Animated.timing(offsetX, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: false,
                        }).start(() => setActive(false));
                    });
                    setTimeout(() => onDelete(), 200);
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                } else {
                    Animated.timing(offsetX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => setActive(false));
                }
            }
        },
        [onEdit, onDelete, offsetX],
    );

    gesture.onStart(() => setActive(false));
    gesture.onChange(handleGestureUpdate);
    gesture.onEnd(handleGestureEnd);

    return [gesture, offsetX, interpolatedBackgroundColor, active] as const;
};

export const swipableContext = createContext<boolean>(false);
export const Swipeable = ({ onEdit, onDelete, onClick, children }: SwipeableProps) => {
    const [gesture, offsetX, interpolatedBackgroundColor, active] = useWorkoutGesturePan({ onEdit, onDelete });

    const Provider = useCallback(
        ({ children }: PropsWithChildren) => {
            return <swipableContext.Provider value={active}>{children}</swipableContext.Provider>;
        },
        [active],
    );

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
    const outerIconOpacity = useMemo(() => offsetX.interpolate({ inputRange: [-1, 0, 1], outputRange: [1, 0, 1], extrapolate: "clamp" }), [offsetX]);
    const outerIconWrapperStyles = useMemo(
        () => [
            styles.iconContainer,
            {
                opacity: outerIconOpacity,
                height: containerMeasures.height,
                width: containerMeasures.width,
                backgroundColor: interpolatedBackgroundColor,
            },
        ],
        [containerMeasures.height, containerMeasures.width, interpolatedBackgroundColor, outerIconOpacity],
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

    const handleClick = useCallback(() => {
        if (active) {
            return;
        }
        onClick();
    }, [onClick, active]);

    return (
        <ReAnimated.View exiting={FadeOut} entering={FadeIn} layout={Layout}>
            <GestureDetector gesture={gesture}>
                <Pressable onPress={handleClick}>
                    <View ref={viewRef} onLayout={containerMeasurement}>
                        <Animated.View style={animatedWrapperStyles}>
                            <ThemedView style={styles.wrapper}>
                                <Provider>{children}</Provider>
                            </ThemedView>
                        </Animated.View>
                        <Animated.View style={outerIconWrapperStyles}>
                            <Animated.View style={innerIconWrapperStyles}>
                                {onEdit && <MaterialCommunityIcons style={styles.editIcon} color={computedColor} name="pencil" size={30} />}
                                {onDelete && <MaterialCommunityIcons style={styles.deleteIcon} color={computedColor} name="delete" size={32} />}
                            </Animated.View>
                        </Animated.View>
                    </View>
                </Pressable>
            </GestureDetector>
        </ReAnimated.View>
    );
};
