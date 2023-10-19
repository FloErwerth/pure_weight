import { EditableExercise, EditableExerciseProps } from "../EditableExercise/EditableExercise";
import { Modal, ModalProps } from "../Modal/Modal";
import { borderRadius } from "../App/theme/border";
import { componentBackgroundColor } from "../App/theme/colors";

type AddExerciseModalProps = ModalProps & Omit<EditableExerciseProps, "onCancel">;
export const AddExerciseModal = (props: AddExerciseModalProps) => {
  return (
    <Modal customContentStyle={{ backgroundColor: componentBackgroundColor, padding: 10, borderRadius }} {...props}>
      <EditableExercise exercise={props.exercise} onConfirmEdit={props.onConfirmEdit} onCancel={() => props.onRequestClose?.()} />
    </Modal>
  );
};
