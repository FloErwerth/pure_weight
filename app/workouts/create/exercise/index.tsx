import { ExerciseMetaData } from "../../../../store/reducers/workout/types";
import { ErrorFields, setError } from "../../../../store/reducers/errors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getEditedExercise, getIsExistingEditedExercise } from "../../../../store/reducers/workout/workoutSelectors";
import { useToast } from "../../../../components/BottomToast/useToast";
import { createNewExercise, storeEditedExercise } from "../../../../store/reducers/workout";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { styles } from "../../../../components/EditableExercise/styles";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { EditableExercise } from "../../../../components/EditableExercise/EditableExercise";
import { BottomToast } from "../../../../components/BottomToast/BottomToast";
import { View } from "react-native";
import { CheckBox } from "../../../../components/Themed/CheckBox/CheckBox";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { HStack } from "../../../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { useNavigateBack } from "../../../../hooks/navigate";

const validateData = (data: Partial<ExerciseMetaData>) => {
    const errors: ErrorFields[] = [];
    if (data.type === "WEIGHT_BASED") {
        if (!data.sets) {
            errors.push("create_sets");
        }
        if (!data.name) {
            errors.push("create_name");
        }
        if (!data.reps) {
            errors.push("create_reps");
        }
        if (!data.weight) {
            errors.push("create_weight");
        }
    }
    return errors;
};

export const CreateExercise = () => {
    const { t } = useTranslation();
    const isEditingExercise = useAppSelector(getIsExistingEditedExercise);
    const title = useMemo(() => t(isEditingExercise ? "exercise_edit_title" : "create_exercise"), [isEditingExercise, t]);
    const dispatch = useAppDispatch();
    const editedExercise = useAppSelector(getEditedExercise);
    const { showToast, openToast, closeToast } = useToast();
    const [addMoreExercises, setAddMoreExercises] = useState(false);
    const navigateBack = useNavigateBack();
    useEffect(() => {
        if (isEditingExercise) {
            setAddMoreExercises(false);
        }
    }, [isEditingExercise]);

    const openSuccessMessage = useCallback(() => {
        openToast();
    }, [openToast]);

    const handleConfirm = useCallback(() => {
        if (showToast) {
            closeToast();
        }
        if (editedExercise) {
            const possibleErrors = validateData(editedExercise.exercise);
            if (possibleErrors.length > 0) {
                dispatch(setError(possibleErrors));
            } else {
                dispatch(storeEditedExercise());
                dispatch(createNewExercise());
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                if (!addMoreExercises) {
                    navigateBack();
                } else {
                    openSuccessMessage();
                }
            }
        }
    }, [addMoreExercises, closeToast, dispatch, editedExercise, navigateBack, openSuccessMessage, showToast]);

    const closeSuccessMessage = useCallback(() => {
        closeToast();
    }, [closeToast]);

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title={title} titleFontSize={40} handleBack={navigateBack} />
            <PageContent safeBottom stretch ghost paddingTop={20}>
                <EditableExercise />
                <BottomToast customTime={1000} topCorrection={20} leftCorrection={-10} padding={20} titleKey="create_exercise_success_title" onRequestClose={closeSuccessMessage} open={showToast} />
                <View>
                    <CheckBox input customWrapperStyles={{ zIndex: -1 }} checked={addMoreExercises} onChecked={setAddMoreExercises} label={t("add_more_exercises")} />
                    <ThemedPressable ghost behind onPress={handleConfirm}>
                        <HStack secondary style={styles.button}>
                            <Text secondary style={styles.buttonText}>
                                {t(isEditingExercise ? "edit_exercise" : "create_exercise")}
                            </Text>
                            <ThemedMaterialCommunityIcons ghost name="pencil-plus-outline" size={20} />
                        </HStack>
                    </ThemedPressable>
                </View>
            </PageContent>
        </ThemedView>
    );
};
