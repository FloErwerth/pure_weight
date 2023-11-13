import { EditableExercise, EditableExerciseProps } from "../EditableExercise/EditableExercise";
import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";
import { RefObject, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAppSelector } from "../../store";
import { getIsEditingExercise } from "../../store/selectors";
import { useTranslation } from "react-i18next";

type AddExerciseModalProps = ThemedBottomSheetModalProps & Omit<EditableExerciseProps, "onCancel"> & { reference: RefObject<BottomSheetModal> };
export const AddExerciseModal = (props: AddExerciseModalProps) => {
  const isEditingExercise = useAppSelector(getIsEditingExercise);
  const { t } = useTranslation();
  const title = useMemo(() => t(isEditingExercise ? "exercise_edit_title" : "create_exercise"), [isEditingExercise, t]);
  return (
    <ThemedButtomSheetModal title={title} ref={props.reference} {...props}>
      <EditableExercise onConfirmEdit={props.onConfirmEdit} />
    </ThemedButtomSheetModal>
  );
};
