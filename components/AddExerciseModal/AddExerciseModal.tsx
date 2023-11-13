import { EditableExercise, EditableExerciseProps } from "../EditableExercise/EditableExercise";
import { ThemedBottomSheetModalProps, ThemedButtomSheetModal } from "../BottomSheetModal/ThemedButtomSheetModal";
import { RefObject } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type AddExerciseModalProps = ThemedBottomSheetModalProps & Omit<EditableExerciseProps, "onCancel"> & { reference: RefObject<BottomSheetModal> };
export const AddExerciseModal = (props: AddExerciseModalProps) => {
  return (
    <ThemedButtomSheetModal ref={props.reference} {...props}>
      <EditableExercise onConfirmEdit={props.onConfirmEdit} />
    </ThemedButtomSheetModal>
  );
};
