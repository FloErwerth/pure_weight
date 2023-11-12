import { EditableExercise, EditableExerciseProps } from "../EditableExercise/EditableExercise";
import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";

type AddExerciseModalProps = ThemedBottomSheetModalProps & Omit<EditableExerciseProps, "onCancel">;
export const AddExerciseModal = (props: AddExerciseModalProps) => {
  return (
    <ThemedButtomSheetModal {...props}>
      <EditableExercise exercise={props.exercise} onConfirmEdit={props.onConfirmEdit} />
    </ThemedButtomSheetModal>
  );
};
