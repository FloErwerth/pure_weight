import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getEditedExercise, getIsExistingEditedExercise } from "../../../../store/reducers/workout/workoutSelectors";
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
import { SnapPoint } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { View } from "react-native";
import Reanimated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

export const CreateExercise = () => {
    const { t } = useTranslation();
    const isEditingExercise = useAppSelector(getIsExistingEditedExercise);
    const title = useMemo(() => t(isEditingExercise ? "exercise_edit_title" : "create_exercise"), [isEditingExercise, t]);
    const dispatch = useAppDispatch();
    const editedExercise = useAppSelector(getEditedExercise);
    const { showToast: showSavedSuccess, openToast: openSavedSuccess, closeToast: closeSavedSuccess } = useToast();
    const [showCheckboxes, setShowCheckboxes] = useState(true);
    const [addMoreExercises, setAddMoreExercises] = useState(false);
    const navigateBack = useNavigateBack();

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

    const addMoreExercisesHelptextConfig = useMemo(
        () => ({ title: t("add_more_exercises"), text: t("add_more_exercises_help"), snapPoints: ["35%"] as SnapPoint[] }),
        [t],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={title} titleFontSize={40} backButtonAction={navigateBack} />
            <PageContent safeBottom stretch ghost paddingTop={20}>
                <EditableExercise />
                <View style={{ gap: 10 }}>
                    {showCheckboxes && (
                        <Reanimated.View style={{ gap: 10 }} layout={Layout} entering={FadeIn} exiting={FadeOut}>
                            <CheckBox
                                secondary
                                customWrapperStyles={{ zIndex: -1 }}
                                checked={addMoreExercises}
                                onChecked={setAddMoreExercises}
                                label={t("add_more_exercises")}
                                helpTextConfig={addMoreExercisesHelptextConfig}
                            />
                        </Reanimated.View>
                    )}
                    <BottomToast
                        time={1000}
                        leftCorrection={-20}
                        titleKey="create_exercise_success_title"
                        onRequestClose={closeSavedSuccessMessage}
                        open={showSavedSuccess}
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
        </ThemedView>
    );
};
