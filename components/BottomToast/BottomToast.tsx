import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { Dimensions, ViewStyle } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import ReAnimated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { borderRadius } from "../../theme/border";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { useAppSelector } from "../../store";
import { getDeletionTime } from "../../store/reducers/settings/settingsSelectors";

interface BottomToastProps {
    reference?: RefObject<{ restart: () => void }>;
    titleKey?: string;
    messageKey?: string;
    onRedo?: () => void;
    onRequestClose: () => void;
    open: boolean;
    bottom?: number;
    padding?: number;
    leftCorrection?: number;
    topCorrection?: number;
    customTime?: number;
}
const deviceWidth = Dimensions.get("screen").width;

const TIME_STEP = 10;
const ANIM_TIME = 300;

const useDeletionTime = (customTime?: number) => {
    const deletionTime = useAppSelector(getDeletionTime);

    if (customTime) {
        return customTime;
    }
    return deletionTime;
};

export const BottomToast = ({ reference, customTime, titleKey, messageKey, onRedo, open, onRequestClose, bottom = 0, padding = 20, leftCorrection, topCorrection }: BottomToastProps) => {
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const { t } = useTranslation();
    const [percent, setPercent] = useState(100);
    const animatedPercent = useSharedValue(100);
    const animatedOpacity = useSharedValue(0);
    const time = useDeletionTime(customTime);
    const timePercentage = useMemo(() => (TIME_STEP / time) * 100, [time]);

    const resetTimer = useCallback(() => {
        animatedPercent.value = 100;
        setPercent(100);
        clearInterval(timer.current);
        timer.current = undefined;
    }, [animatedPercent]);

    const handleRequestClose = useCallback(() => {
        onRequestClose();
        setTimeout(() => {
            resetTimer();
        }, ANIM_TIME);
    }, [onRequestClose, resetTimer]);

    const startTimer = useCallback(() => {
        timer.current = setInterval(() => {
            setPercent((prev) => prev - timePercentage);
        }, TIME_STEP);
    }, [timePercentage]);

    useEffect(() => {
        if (open && reference?.current) {
            reference.current.restart = () => {
                resetTimer();
                startTimer();
            };
        }
    }, [open, reference, resetTimer, startTimer]);

    useEffect(() => {
        if (open && timer.current === undefined) {
            startTimer();
            animatedOpacity.value = withTiming(1, { duration: ANIM_TIME });
        } else {
            handleRequestClose();
            animatedOpacity.value = withTiming(0, { duration: ANIM_TIME });
        }
    }, [startTimer, handleRequestClose, open, animatedOpacity]);

    useEffect(() => {
        if (percent <= 0) {
            handleRequestClose();
            return;
        }
        animatedPercent.value = withTiming(percent, { duration: TIME_STEP });
    }, [animatedPercent, handleRequestClose, percent]);

    const progressBarStyle = useAnimatedStyle(() => ({ backgroundColor: "#666", width: `${animatedPercent.value}%`, height: 5, borderRadius: 5, overflow: "hidden" }) as const, [animatedPercent]);

    const wrapperStyle = useMemo(
        () =>
            ({
                position: "absolute",
                gap: 10,
                bottom,
                padding: 20,
                paddingBottom: 10,
                marginHorizontal: padding / 2,
                width: deviceWidth - padding,
                borderRadius,
                zIndex: 100,
                left: leftCorrection ? leftCorrection : 0,
                transform: [{ translateY: topCorrection ? topCorrection : 0 }],
            }) satisfies ViewStyle,
        [bottom, leftCorrection, padding, topCorrection],
    );
    const animatedWrapperStyle = useAnimatedStyle(() => ({ opacity: animatedOpacity.value, pointerEvents: open ? "auto" : "none" }), [open, animatedOpacity, wrapperStyle]);

    return (
        <ReAnimated.View style={animatedWrapperStyle}>
            <ThemedView secondary style={wrapperStyle}>
                {titleKey && (
                    <Text ghost style={{ fontSize: 20, textAlign: "center", fontWeight: "bold", marginBottom: messageKey ? 0 : 5 }}>
                        {t(titleKey)}
                    </Text>
                )}
                {messageKey && (
                    <ThemedPressable style={{ padding: 10, borderRadius }} onPress={onRedo}>
                        <HStack style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 10 }}>
                            <Text>{t(messageKey)}</Text>
                            <ThemedMaterialCommunityIcons ghost name="undo" size={16} />
                        </HStack>
                    </ThemedPressable>
                )}
                <ThemedView style={{ width: "100%" }}>
                    <ReAnimated.View style={progressBarStyle} />
                </ThemedView>
            </ThemedView>
        </ReAnimated.View>
    );
};
