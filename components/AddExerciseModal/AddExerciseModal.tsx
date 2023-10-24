import { EditableExercise, EditableExerciseProps } from "../EditableExercise/EditableExercise";
import { Modal, ModalProps } from "../Modal/Modal";

type AddExerciseModalProps = ModalProps & Omit<EditableExerciseProps, "onCancel">;
export const AddExerciseModal = (props: AddExerciseModalProps) => {
  return (
    <Modal {...props}>
      <EditableExercise exercise={props.exercise} onConfirmEdit={props.onConfirmEdit} />
    </Modal>
  );
};
