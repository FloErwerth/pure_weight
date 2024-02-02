import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getEditedExercise, getHasTemplates, getIsExistingEditedExercise } from "../../../../store/reducers/workout/workoutSelectors";
import { useToast } from "../../../../components/BottomToast/useToast";
import { createNewExercise, saveEditedExercise, saveExerciseAsTemplate, updateTemplate } from "../../../../store/reducers/workout";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { styles } from "../../../../components/EditableExercise/styles";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { EditableExercise } from "../../../../components/EditableExercise/EditableExercise";
import { BottomToast } from "../../../../components/BottomToast/BottomToast";
import { CheckBox } from "../../../../components/Themed/CheckBox/CheckBox";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { useNavigateBack } from "../../../../hooks/navigate";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { TemplateSelection } from "../../../../components/TemplateSelection/TemplateSelection";
import { Animated, View } from "react-native";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";
import { getLanguage } from "../../../../store/reducers/settings/settingsSelectors";
import Reanimated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

export const CreateExercise = () => {
    const { t } = useTranslation();
    const isEditingExercise = useAppSelector(getIsExistingEditedExercise);
    const title = useMemo(() => t(isEditingExercise ? "exercise_edit_title" : "create_exercise"), [isEditingExercise, t]);
    const dispatch = useAppDispatch();
    const editedExercise = useAppSelector(getEditedExercise);
    const { showToast: showSavedSuccess, openToast: openSavedSuccess, closeToast: closeSavedSuccess } = useToast();
    const { showToast: showApplySuccess, openToast: openApplySuccess, closeToast: closeApplySuccess } = useToast();
    const [showCheckboxes, setShowCheckboxes] = useState(true);
    const [addMoreExercises, setAddMoreExercises] = useState(false);
    const { ref: warningRef, openBottomSheet: openWarning, closeBottomSheet: closeWarning, isOpen: showWarning } = useBottomSheetRef();
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const navigateBack = useNavigateBack();
    const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
    const hasTemplates = useAppSelector(getHasTemplates);
    const language = useAppSelector(getLanguage);
    const warningSnapPoints: SnapPoint[] = useMemo(() => [language === "en" ? "55%" : "60%"], [language]);
    const isFromTemplate = Boolean(editedExercise?.exercise.templateId);

    useEffect(() => {
        if (isEditingExercise) {
            setAddMoreExercises(false);
        }
    }, [isEditingExercise]);

    const openSuccessMessage = useCallback(() => {
        openSavedSuccess();
    }, [openSavedSuccess]);

    const showCheckboxesAfterTimeout = useCallback(() => {
        setTimeout(() => {
            setShowCheckboxes(true);
        }, 2200);
    }, []);

    const saveExercise = useCallback(() => {
        dispatch(saveEditedExercise());
        dispatch(updateTemplate());
        openSuccessMessage();
        setShowCheckboxes(false);
        showCheckboxesAfterTimeout();
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (addMoreExercises) {
            dispatch(createNewExercise());
        } else {
            navigateBack();
        }
    }, [addMoreExercises, dispatch, navigateBack, openSuccessMessage, showCheckboxesAfterTimeout]);

    const saveTemplate = useCallback(() => {
        if (showWarning) {
            closeWarning();
        }
        dispatch(saveExerciseAsTemplate({ overwrite: false }));
        saveExercise();
    }, [closeWarning, dispatch, saveExercise, showWarning]);

    const overwriteTemplate = useCallback(() => {
        if (showWarning) {
            closeWarning();
        }
        dispatch(saveExerciseAsTemplate({ overwrite: true }));
        saveExercise();
    }, [closeWarning, dispatch, saveExercise, showWarning]);

    const handleConfirm = useCallback(() => {
        if (showSavedSuccess) {
            closeSavedSuccess();
        }
        if (editedExercise) {
            if (saveAsTemplate) {
                if (isFromTemplate) {
                    openWarning();
                    return;
                }
                saveTemplate();
                return;
            }
            saveExercise();
        }
    }, [closeSavedSuccess, editedExercise, isFromTemplate, openWarning, saveAsTemplate, saveExercise, saveTemplate, showSavedSuccess]);

    const closeSavedSuccessMessage = useCallback(() => {
        closeSavedSuccess();
    }, [closeSavedSuccess]);

    const confirmButtonConfig = useMemo(
        () => ({
            icon: { name: "content-copy", size: 24 } as const,
            disabled: !hasTemplates,
            opacity: new Animated.Value(hasTemplates ? 1 : 0),
        }),
        [hasTemplates],
    );

    const handleApplyTemplate = useCallback(() => {
        setShowCheckboxes(false);
        showCheckboxesAfterTimeout();
        closeBottomSheet();
        openApplySuccess();
    }, [closeBottomSheet, openApplySuccess, showCheckboxesAfterTimeout]);

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons
                title={title}
                titleFontSize={40}
                handleBack={navigateBack}
                handleConfirmIcon={confirmButtonConfig.icon}
                handleConfirmOpacity={confirmButtonConfig.opacity}
                confirmButtonDisabled={confirmButtonConfig.disabled}
                handleConfirm={openBottomSheet}
            />
            <PageContent safeBottom stretch ghost paddingTop={20}>
                <EditableExercise />
                <View style={{ gap: 10 }}>
                    {showCheckboxes && (
                        <Reanimated.View style={{ gap: 10 }} layout={Layout} entering={FadeIn} exiting={FadeOut}>
                            <CheckBox
                                helpTextConfig={{ text: t("save_as_template_help"), snapPoints: ["35%"] }}
                                secondary
                                customWrapperStyles={{ zIndex: -1 }}
                                checked={saveAsTemplate}
                                onChecked={setSaveAsTemplate}
                                label={t("save_as_template")}
                            />
                            <CheckBox
                                secondary
                                customWrapperStyles={{ zIndex: -1 }}
                                checked={addMoreExercises}
                                onChecked={setAddMoreExercises}
                                label={t("add_more_exercises")}
                            />
                        </Reanimated.View>
                    )}
                    <BottomToast
                        customTime={1000}
                        leftCorrection={-20}
                        titleKey="create_exercise_success_title"
                        onRequestClose={closeSavedSuccessMessage}
                        open={showSavedSuccess}
                    />
                    <BottomToast
                        customTime={1000}
                        leftCorrection={-20}
                        titleKey="applied_template_success_title"
                        onRequestClose={closeApplySuccess}
                        open={showApplySuccess}
                    />
                    <ThemedPressable ghost behind onPress={handleConfirm}>
                        <HStack secondary style={styles.button}>
                            <Text secondary style={styles.buttonText}>
                                {t(isEditingExercise ? "edit_exercise_long" : "create_exercise")}
                            </Text>
                            <ThemedMaterialCommunityIcons ghost name="pencil-plus-outline" size={20} />
                        </HStack>
                    </ThemedPressable>
                </View>
            </PageContent>
            <ThemedBottomSheetModal snapPoints={warningSnapPoints} title={t("save_as_template_warning_title")} ref={warningRef}>
                <PageContent paddingTop={20} stretch ghost>
                    <ThemedView ghost stretch>
                        <AnswerText>{t("save_as_template_warning_text")}</AnswerText>
                    </ThemedView>
                    <ThemedPressable round padding onPress={overwriteTemplate}>
                        <Text>{t("save_as_template_warning_overwrite")}</Text>
                    </ThemedPressable>
                    <ThemedPressable round padding onPress={saveTemplate}>
                        <Text>{t("save_as_template_warning_create_new")}</Text>
                    </ThemedPressable>
                </PageContent>
            </ThemedBottomSheetModal>
            <TemplateSelection onApplyTemplate={handleApplyTemplate} reference={ref} />
        </ThemedView>
    );
};
