import { ReactNode, RefObject, useCallback, useMemo, useState } from "react";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../Stack/HStack/HStack";
import { PageContent } from "../PageContent/PageContent";
import { useAppSelector } from "../../store";
import { getLanguage } from "../../store/selectors/settings/settingsSelectors";
import { View } from "react-native";
import { AnswerText } from "../HelpQuestionAnswer/AnswerText";
import { styles } from "./styles";

interface BackButtonModal {
    onConfirm: () => void;
    onCancel: () => void;
    onPause: () => void;
    title?: string;
    isVisible?: boolean;
    reference: RefObject<BottomSheetModal>;
    workoutDone?: boolean;
}

const useHelpContent = (): Record<"save" | "pause" | "cancel", { title: string; content: ReactNode }> => {
    const { t } = useTranslation();
    const language = useAppSelector(getLanguage);

    const saveContent = useMemo(() => {
        if (language === "de") {
            return (
                <View>
                    <AnswerText>Wenn Du dein Workout speicherst wird der aktuelle Fortschritt gespeichert und ausgewertet.</AnswerText>
                    <AnswerText>Achtung: Dein Workout kann später nicht fortgesetzt werden.</AnswerText>
                </View>
            );
        }
        return (
            <View>
                <AnswerText>If you save your workout the current progress will be saved and evaluated.</AnswerText>
                <AnswerText>Attention: Your workout cannot be continued later.</AnswerText>
            </View>
        );
    }, [language]);

    const pauseContent = useMemo(() => {
        if (language === "de") {
            return (
                <View>
                    <AnswerText>Wenn Du dein Workout pausierst wird der aktuelle Fortschritt festgehalten.</AnswerText>
                    <AnswerText>Dein Workout kann später fortgesetzt werden.</AnswerText>
                </View>
            );
        }
        return (
            <View>
                <AnswerText>If you pause your workout the current progress will be reminded.</AnswerText>
                <AnswerText>Your workout can be continued later.</AnswerText>
            </View>
        );
    }, [language]);

    const cancelContent = useMemo(() => {
        if (language === "de") {
            return (
                <View>
                    <AnswerText>Wenn Du dein Workout abbrichst wird der aktuelle Fortschritt verworfen.</AnswerText>
                    <AnswerText>Dein Workout kann später nicht fortgesetzt werden.</AnswerText>
                </View>
            );
        }
        return (
            <View>
                <AnswerText>If you cancel your workout the current progress will be discarded.</AnswerText>
                <AnswerText>Your workout cannot be continued later.</AnswerText>
            </View>
        );
    }, [language]);

    return useMemo(
        () => ({
            save: {
                title: t("workout_save"),
                content: saveContent,
            },
            pause: {
                title: t("workout_pause"),
                content: pauseContent,
            },
            cancel: {
                title: t("workout_cancel"),
                content: cancelContent,
            },
        }),
        [cancelContent, pauseContent, saveContent, t],
    );
};

export const BackButtonModal = ({ title, reference, onPause, onCancel, onConfirm, workoutDone }: BackButtonModal) => {
    const { t } = useTranslation();
    const { ref, openBottomSheet } = useBottomSheetRef();
    const [helpConfigKey, setHelpConfigKey] = useState<"save" | "pause" | "cancel">("save");
    const helpContent = useHelpContent();
    const helpConfig = useMemo(() => helpContent[helpConfigKey], [helpConfigKey, helpContent]);

    const handleConfirmButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onConfirm();
    }, [onConfirm]);

    const handleCancelButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCancel();
    }, [onCancel]);

    const handlePauseButton = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPause();
    }, [onPause]);

    const saveText = useMemo(() => t("workout_save"), [t]);
    const cancelText = useMemo(() => t("workout_cancel"), [t]);
    const pauseText = useMemo(() => t("workout_pause"), [t]);

    const handleOpenSaveHelp = useCallback(() => {
        openBottomSheet();
        setHelpConfigKey("save");
    }, [openBottomSheet]);

    const handleOpenPause = useCallback(() => {
        openBottomSheet();
        setHelpConfigKey("pause");
    }, [openBottomSheet]);

    const handleOpenCancelHelp = useCallback(() => {
        openBottomSheet();
        setHelpConfigKey("cancel");
    }, [openBottomSheet]);

    return (
        <ThemedBottomSheetModal ref={reference} title={title}>
            <PageContent scrollable={false} paddingTop={20} ghost>
                <HStack style={styles.gap} ghost>
                    <ThemedPressable stretch secondary padding round onPress={handleConfirmButton}>
                        <HStack ghost style={styles.gap}>
                            <ThemedMaterialCommunityIcons ghost name="content-save-outline" size={26} />
                            <Text style={styles.buttonText} center ghost>
                                {saveText}
                            </Text>
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable onPress={handleOpenSaveHelp} ghost style={{ justifyContent: "center" }}>
                        <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={30} />
                    </ThemedPressable>
                </HStack>
                {!workoutDone && (
                    <HStack style={styles.gap} ghost>
                        <ThemedPressable stretch secondary padding round onPress={handlePauseButton}>
                            <HStack ghost style={styles.gap}>
                                <ThemedMaterialCommunityIcons ghost name="pause" size={26} />
                                <Text style={styles.buttonText} center ghost>
                                    {pauseText}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                        <ThemedPressable onPress={handleOpenPause} ghost style={styles.pressableCenter}>
                            <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={30} />
                        </ThemedPressable>
                    </HStack>
                )}
                <HStack style={styles.gap} ghost>
                    <ThemedPressable stretch secondary padding round onPress={handleCancelButton}>
                        <HStack ghost style={styles.gap}>
                            <ThemedMaterialCommunityIcons ghost name="delete" size={26} />
                            <Text style={styles.buttonText} center ghost>
                                {cancelText}
                            </Text>
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable onPress={handleOpenCancelHelp} ghost style={styles.pressableCenter}>
                        <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={30} />
                    </ThemedPressable>
                </HStack>
            </PageContent>
            <ThemedBottomSheetModal title={helpConfig.title} ref={ref}>
                <PageContent ghost paddingTop={20}>
                    {helpConfig.content}
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedBottomSheetModal>
    );
};
