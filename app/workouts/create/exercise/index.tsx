import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getEditedExercise } from "../../../../store/selectors/workout/workoutSelectors";
import { useToast } from "../../../../components/BottomToast/useToast";
import { createNewExercise, saveEditedExercise } from "../../../../store/reducers/workout";
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
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { View } from "react-native";
import Reanimated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { cleanError, setError } from "../../../../store/reducers/errors";
import { ErrorFields } from "../../../../store/reducers/errors/types";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";

const getIsZeroOrNullish = (values: Array<string | undefined>) => values.some((value) => !value || value === "0" || value === "00");

const useValidateExercise = () => {
    const dispatch = useAppDispatch();
    const editedExercise = useAppSelector(getEditedExercise);

    useEffect(() => {
        if (editedExercise?.exercise.type === "TIME_BASED") {
            dispatch(cleanError(["create_exercise_sets", "create_exercise_reps", "create_exercise_weight"]));
        } else {
            dispatch(cleanError(["create_exercise_sets", "create_exercise_duration"]));
        }
    }, [editedExercise?.exercise.type]);

    return useCallback(() => {
        const exercise = editedExercise?.exercise;
        const errors: ErrorFields[] = [];
        if (getIsZeroOrNullish([exercise?.sets])) {
            errors.push("create_exercise_sets");
        }
        if (!exercise?.name) {
            errors.push("create_exercise_name");
        }
        if (exercise?.type === "WEIGHT_BASED") {
            if (getIsZeroOrNullish([exercise?.reps])) {
                errors.push("create_exercise_reps");
            }
            if (getIsZeroOrNullish([exercise?.weight])) {
                errors.push("create_exercise_weight");
            }
        }
        if (exercise?.type === "TIME_BASED") {
            const hasNoMinutes = getIsZeroOrNullish([editedExercise?.exercise?.durationMinutes]);
            const hasNoSeconds = getIsZeroOrNullish([editedExercise?.exercise?.durationSeconds]);
            if (hasNoMinutes && hasNoSeconds) {
                errors.push("create_exercise_duration");
            }
        }
        dispatch(setError(errors));
        return errors.length === 0;
    }, [dispatch, editedExercise?.exercise]);
};

const useWasEdited = () => {
    const editedExercise = useAppSelector(getEditedExercise);
    return useMemo(() => editedExercise?.stringifiedExercise !== JSON.stringify(editedExercise?.exercise), [editedExercise?.exercise, editedExercise?.stringifiedExercise]);
};

export const CreateExercise = () => {
    const { t } = useTranslation();
    const editedExercise = useAppSelector(getEditedExercise);
    const isNewExercise = Boolean(editedExercise?.isNewExercise);
    const title = useMemo(() => t(!isNewExercise ? "exercise_edit_title" : "create_exercise"), [isNewExercise, t]);
    const dispatch = useAppDispatch();
    const { showToast: showSavedSuccess, openToast: openSavedSuccess, closeToast: closeSavedSuccess } = useToast();
    const [showCheckboxes, setShowCheckboxes] = useState(true);
    const [addMoreExercises, setAddMoreExercises] = useState(false);
    const { ref, openBottomSheet } = useBottomSheetRef();
    const navigateBack = useNavigateBack();
    const validateExercise = useValidateExercise();
    const wasEdited = useWasEdited();

    useEffect(() => {
        if (!isNewExercise) {
            setAddMoreExercises(false);
        }
    }, [isNewExercise]);

    const openSuccessMessage = useCallback(() => {
        openSavedSuccess();
    }, [openSavedSuccess]);

    const showCheckboxesAfterTimeout = useCallback(() => {
        setTimeout(() => {
            setShowCheckboxes(true);
        }, 2200);
    }, []);

    const saveExercise = useCallback(() => {
        if (!validateExercise()) {
            return;
        }
        dispatch(saveEditedExercise());
        openSuccessMessage();
        setShowCheckboxes(false);
        showCheckboxesAfterTimeout();
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (addMoreExercises) {
            dispatch(createNewExercise());
        } else {
            navigateBack();
        }
    }, [addMoreExercises, dispatch, navigateBack, openSuccessMessage, showCheckboxesAfterTimeout, validateExercise]);

    const handleConfirm = useCallback(() => {
        if (showSavedSuccess) {
            closeSavedSuccess();
        }
        if (editedExercise) {
            saveExercise();
        }
    }, [closeSavedSuccess, editedExercise, saveExercise, showSavedSuccess]);

    const closeSavedSuccessMessage = useCallback(() => {
        closeSavedSuccess();
    }, [closeSavedSuccess]);

    const addMoreExercisesHelptextConfig = useMemo(() => ({ title: t("add_more_exercises"), text: t("add_more_exercises_help") }), [t]);

    const alertContent = useMemo(() => t(!isNewExercise ? "alert_edit_exercise_discard_content" : "alert_create_exercise_discard_content"), [isNewExercise, t]);

    const alertTitle = useMemo(() => t(!isNewExercise ? "alert_edit_discard_title" : "alert_create_discard_title"), [isNewExercise, t]);

    const discardButtonText = useMemo(() => t(!isNewExercise ? "alert_edit_confirm_cancel" : "alert_create_confirm_cancel"), [isNewExercise, t]);

    const clearExerciseErrors = useCallback(() => {
        dispatch(cleanError(["create_exercise_name", "create_exercise_sets", "create_exercise_reps", "create_exercise_weight", "create_exercise_duration"]));
    }, [dispatch]);

    const handleNavigateBack = useCallback(() => {
        if (wasEdited) {
            openBottomSheet();
            return;
        }
        clearExerciseErrors();
        navigateBack();
    }, [clearExerciseErrors, wasEdited, navigateBack, openBottomSheet]);

    const handleDiscardExercise = useCallback(() => {
        clearExerciseErrors();
        navigateBack();
    }, [clearExerciseErrors, navigateBack]);

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={title} backButtonAction={handleNavigateBack} />
            <PageContent safeBottom stretch ghost>
                <EditableExercise />
                <View style={styles.gap}>
                    {showCheckboxes && (
                        <Reanimated.View style={styles.gap} layout={Layout} entering={FadeIn} exiting={FadeOut}>
                            <CheckBox
                                secondary
                                customWrapperStyles={styles.zIndex}
                                checked={addMoreExercises}
                                onChecked={setAddMoreExercises}
                                label={t("add_more_exercises")}
                                helpTextConfig={addMoreExercisesHelptextConfig}
                            />
                        </Reanimated.View>
                    )}
                    <BottomToast time={1000} leftCorrection={-20} titleKey="create_exercise_success_title" onRequestClose={closeSavedSuccessMessage} open={showSavedSuccess} />
                    <ThemedPressable ghost behind onPress={handleConfirm}>
                        <HStack secondary style={styles.button}>
                            <Text secondary style={styles.buttonText}>
                                {t(!isNewExercise ? "edit_exercise" : "create_exercise")}
                            </Text>
                            <ThemedMaterialCommunityIcons ghost name="pencil-plus-outline" size={20} />
                        </HStack>
                    </ThemedPressable>
                </View>
            </PageContent>
            <ThemedBottomSheetModal title={alertTitle} ref={ref}>
                <PageContent stretch ghost>
                    <AnswerText>{alertContent}</AnswerText>
                </PageContent>
                <PageContent ghost paddingTop={30}>
                    <ThemedView ghost style={{ gap: 10 }}>
                        <ThemedPressable round padding secondary onPress={handleDiscardExercise}>
                            <HStack ghost style={{ alignItems: "center", gap: 10 }}>
                                <ThemedMaterialCommunityIcons ghost name="delete" size={24} />
                                <Text ghost>{discardButtonText}</Text>
                            </HStack>
                        </ThemedPressable>
                    </ThemedView>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
