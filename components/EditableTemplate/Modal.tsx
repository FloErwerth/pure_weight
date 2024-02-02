import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { RefObject, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAppDispatch } from "../../store";
import { saveEditedExerciseTemplate } from "../../store/reducers/workout";

type EditableTemplateModalProps = {
    reference: RefObject<BottomSheetModal>;
    onRequestClose?: () => void;
};

export const EditableTemplateModal = ({ reference, onRequestClose }: EditableTemplateModalProps) => {
    const dispatch = useAppDispatch();

    const handleClose = useCallback(() => {
        dispatch(saveEditedExerciseTemplate());
        onRequestClose?.();
    }, [dispatch, onRequestClose]);

    return <ThemedBottomSheetModal onRequestClose={handleClose} title="Edit template" ref={reference}></ThemedBottomSheetModal>;
};
