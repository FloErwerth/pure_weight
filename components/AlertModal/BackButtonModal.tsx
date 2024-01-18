import { ReactNode, RefObject, useCallback, useMemo, useState } from "react";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { HStack } from "../Stack/HStack/HStack";
import { PageContent } from "../PageContent/PageContent";
import { useAppSelector } from "../../store";
import { getLanguage } from "../../store/reducers/settings/settingsSelectors";
import { View } from "react-native";
import { AnswerText } from "../HelpQuestionAnswer/AnswerText";

interface BackButtonModal {
    onConfirm: () => void;
    onCancel: () => void;
    onPause: () => void;
    snapPoints?: SnapPoint[];
    title?: string;
    isVisible?: boolean;
    reference: RefObject<BottomSheetModal>;
    workoutDone?: boolean;
}

const useHelpContent = (): Record<"save" | "pause" | "cancel", { title: string; content: ReactNode; snapPoints: SnapPoint[] }> => {
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
                snapPoints: ["35%"],
            },
            pause: {
                title: t("workout_pause"),
                content: pauseContent,
                snapPoints: ["32%"],
            },
            cancel: {
                title: t("workout_cancel"),
                content: cancelContent,
                snapPoints: ["35%"],
            },
        }),
        [cancelContent, pauseContent, saveContent, t],
    );
};

export const BackButtonModal = ({ title, snapPoints = ["25%"], reference, onPause, onCancel, onConfirm, workoutDone }: BackButtonModal) => {
    const { t } = useTranslation();
    const [ref, open] = useBottomSheetRef();
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
        open();
        setHelpConfigKey("save");
    }, [open]);

    const handleOpenPause = useCallback(() => {
        open();
        setHelpConfigKey("pause");
    }, [open]);

    const handleOpenCancelHelp = useCallback(() => {
        open();
        setHelpConfigKey("cancel");
    }, [open]);

    return (
        <ThemedBottomSheetModal snapPoints={snapPoints} ref={reference} title={title}>
            <PageContent paddingTop={20} ghost>
                <HStack style={{ gap: 10 }} ghost>
                    <ThemedPressable stretch secondary padding round onPress={handleConfirmButton}>
                        <HStack ghost style={{ gap: 10 }}>
                            <ThemedMaterialCommunityIcons ghost name="content-save-outline" size={26} />
                            <Text style={{ fontSize: 20, alignSelf: "center" }} center ghost>
                                {saveText}
                            </Text>
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable onPress={handleOpenSaveHelp} ghost style={{ justifyContent: "center" }}>
                        <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={30} />
                    </ThemedPressable>
                </HStack>
                {!workoutDone && (
                    <HStack style={{ gap: 10 }} ghost>
                        <ThemedPressable stretch secondary padding round onPress={handlePauseButton}>
                            <HStack ghost style={{ gap: 10 }}>
                                <ThemedMaterialCommunityIcons ghost name="pause" size={26} />
                                <Text style={{ fontSize: 20, alignSelf: "center" }} center ghost>
                                    {pauseText}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                        <ThemedPressable onPress={handleOpenPause} ghost style={{ justifyContent: "center" }}>
                            <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={30} />
                        </ThemedPressable>
                    </HStack>
                )}
                <HStack style={{ gap: 10 }} ghost>
                    <ThemedPressable stretch secondary padding round onPress={handleCancelButton}>
                        <HStack ghost style={{ gap: 10 }}>
                            <ThemedMaterialCommunityIcons ghost name="delete" size={26} />
                            <Text style={{ fontSize: 20, alignSelf: "center" }} center ghost>
                                {cancelText}
                            </Text>
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable onPress={handleOpenCancelHelp} ghost style={{ justifyContent: "center" }}>
                        <ThemedMaterialCommunityIcons ghost name="help-circle-outline" size={30} />
                    </ThemedPressable>
                </HStack>
            </PageContent>
            <ThemedBottomSheetModal title={helpConfig.title} snapPoints={helpConfig.snapPoints} ref={ref}>
                <PageContent ghost paddingTop={20}>
                    {helpConfig.content}
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedBottomSheetModal>
    );
};
