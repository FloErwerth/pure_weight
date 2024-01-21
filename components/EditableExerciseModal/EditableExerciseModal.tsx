import { EditableExercise } from "../EditableExercise/EditableExercise";
import { ThemedBottomSheetModal, ThemedBottomSheetModalProps } from "../BottomSheetModal/ThemedBottomSheetModal";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { HStack } from "../Stack/HStack/HStack";
import { styles } from "../EditableExercise/styles";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import * as Haptics from "expo-haptics";
import { useAppDispatch, useAppSelector } from "../../store";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedView } from "../Themed/ThemedView/View";
import { ErrorFields, setError } from "../../store/reducers/errors";
import { getEditedExercise, getIsExistingEditedExercise } from "../../store/reducers/workout/workoutSelectors";
import { createNewExercise, storeEditedExercise } from "../../store/reducers/workout";
import { ExerciseMetaData } from "../../store/reducers/workout/types";
import { View } from "react-native";
import { BottomToast } from "../BottomToast/BottomToast";
import { CheckBox } from "../Themed/CheckBox/CheckBox";

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

type AddExerciseModalProps = ThemedBottomSheetModalProps & {
    reference: RefObject<BottomSheetModal>;
};

export const EditableExerciseModal = (props: AddExerciseModalProps) => {
    const { t } = useTranslation();
    const isEditingExercise = useAppSelector(getIsExistingEditedExercise);
    const title = useMemo(() => t(isEditingExercise ? "exercise_edit_title" : "create_exercise"), [isEditingExercise, t]);
    const dispatch = useAppDispatch();
    const editedExercise = useAppSelector(getEditedExercise);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [addMoreExercises, setAddMoreExercises] = useState(false);

    useEffect(() => {
        if (isEditingExercise) {
            setAddMoreExercises(false);
        }
    }, [isEditingExercise]);

    const openSuccessMessage = useCallback(() => {
        setShowSuccessMessage(true);
    }, []);

    const handleConfirm = useCallback(() => {
        if (showSuccessMessage) {
            setShowSuccessMessage(false);
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
                    props.reference.current?.close();
                } else {
                    openSuccessMessage();
                }
            }
        }
    }, [addMoreExercises, dispatch, editedExercise, openSuccessMessage, props, props.reference]);

    const closeSuccessMessage = useCallback(() => {
        setShowSuccessMessage(false);
    }, []);

    return (
        <ThemedBottomSheetModal snapPoints={["100%"]} ref={props.reference} {...props} title={title}>
            <ThemedView stretch ghost style={styles.innerWrapper}>
                <EditableExercise />
                <BottomToast
                    customTime={1000}
                    topCorrection={20}
                    leftCorrection={-10}
                    padding={20}
                    titleKey="create_exercise_success_title"
                    onRequestClose={closeSuccessMessage}
                    open={showSuccessMessage}
                />
                <View>
                    <CheckBox customWrapperStyles={{ zIndex: -1 }} checked={addMoreExercises} onChecked={setAddMoreExercises} label={t("add_more_exercises")} />
                    <ThemedPressable ghost behind onPress={handleConfirm}>
                        <HStack secondary style={styles.button}>
                            <Text secondary style={styles.buttonText}>
                                {t(isEditingExercise ? "edit_exercise" : "create_exercise")}
                            </Text>
                            <ThemedMaterialCommunityIcons ghost name="pencil-plus-outline" size={20} />
                        </HStack>
                    </ThemedPressable>
                </View>
            </ThemedView>
        </ThemedBottomSheetModal>
    );
};
