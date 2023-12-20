import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { Dimensions, Pressable } from "react-native";
import { ThemedView } from "../Themed/ThemedView/View";
import ReAnimated, { Layout, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { borderRadius } from "../../theme/border";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { useAppSelector } from "../../store";
import { getDeletionTime } from "../../store/reducers/settings/settingsSelectors";

interface BottomToastProps {
    titleKey: string;
    messageKey: string;
    onRedo: () => void;
    onRequestClose: () => void;
    open: boolean;
    bottom?: number;
    padding?: number;
}
const deviceWidth = Dimensions.get("screen").width;

const TIME_STEP = 50;
export const BottomToast = ({ titleKey, messageKey, onRedo, open, onRequestClose, bottom = 0, padding = 20 }: BottomToastProps) => {
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const { t } = useTranslation();
    const [percent, setPercent] = useState(100);
    const animatedPercent = useSharedValue(100);
    const time = useAppSelector(getDeletionTime);
    const timePercentage = useMemo(() => (TIME_STEP / time) * 100, [time]);

    const handleRequestClose = useCallback(() => {
        onRequestClose();

        animatedPercent.value = 100;
        setPercent(100);

        clearInterval(timer.current);
        timer.current = undefined;
    }, [animatedPercent, onRequestClose]);

    const startTimer = useCallback(() => {
        timer.current = setInterval(() => {
            setPercent((prev) => prev - timePercentage);
        }, TIME_STEP);
    }, [timePercentage]);

    useEffect(() => {
        if (open && timer.current === undefined) {
            startTimer();
        } else if (!open) {
            handleRequestClose();
        }
    }, [open]);

    useEffect(() => {
        if (percent <= 0) {
            handleRequestClose();
        }
        animatedPercent.value = withTiming(percent, { duration: TIME_STEP });
    }, [animatedPercent, handleRequestClose, percent]);

    const progressBarStyle = useAnimatedStyle(() => ({ backgroundColor: "#666", width: `${animatedPercent.value}%`, height: 5, borderRadius: 5, overflow: "hidden" }) as const, [animatedPercent]);
    if (!open) {
        return null;
    }

    return (
        <ReAnimated.View layout={Layout} entering={SlideInDown} exiting={SlideOutDown}>
            <Pressable onLongPress={handleRequestClose}>
                <ThemedView
                    secondary
                    style={{
                        position: "absolute",
                        gap: 10,
                        bottom,
                        padding: 20,
                        marginHorizontal: padding / 2,
                        width: deviceWidth - padding,
                        borderRadius,
                    }}
                >
                    <Text ghost style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}>
                        {t(titleKey)}
                    </Text>
                    <ThemedPressable style={{ padding: 10, borderRadius }} onPress={onRedo}>
                        <HStack style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 10 }}>
                            <Text>{t(messageKey)}</Text>
                            <ThemedMaterialCommunityIcons ghost name="undo" size={16} />
                        </HStack>
                    </ThemedPressable>
                    <ThemedView style={{ width: "100%" }}>
                        <ReAnimated.View style={progressBarStyle} />
                    </ThemedView>
                </ThemedView>
            </Pressable>
        </ReAnimated.View>
    );
};
