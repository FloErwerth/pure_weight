import { EditableExercise, EditableExerciseProps } from "../EditableExercise/EditableExercise";
import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";
import { RefObject, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";

type AddExerciseModalProps = ThemedBottomSheetModalProps & Omit<EditableExerciseProps, "onCancel"> & { isEditingExercise: boolean; reference: RefObject<BottomSheetModal> };
export const AddExerciseModal = (props: AddExerciseModalProps) => {
  const { t } = useTranslation();
  const title = useMemo(() => t(props.isEditingExercise ? "exercise_edit_title" : "create_exercise"), [props.isEditingExercise, t]);
  return (
    <ThemedButtomSheetModal title={title} ref={props.reference} {...props}>
      <EditableExercise handleEditExercise={props.handleEditExercise} editedExercise={props.editedExercise} onConfirmEdit={props.onConfirmEdit} />
    </ThemedButtomSheetModal>
  );
};
