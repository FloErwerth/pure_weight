import { ThemedPressable } from "../../Themed/Pressable/Pressable";
import { ExerciseTemplate } from "../../../store/reducers/workout/types";
import { useAppDispatch } from "../../../store";
import React, { useCallback } from "react";
import { applyTemplateToEditedExercise } from "../../../store/reducers/workout";
import { TemplateCardContent } from "./TemplateCardContent";

type TemplateCardProps = {
    template: ExerciseTemplate;
    onApplyTemplate?: () => void;
};

export const TemplateCard = ({ template, onApplyTemplate }: TemplateCardProps) => {
    const dispatch = useAppDispatch();

    const handleApplyTemplate = useCallback(() => {
        if (onApplyTemplate) {
            dispatch(applyTemplateToEditedExercise({ templateId: template.templateId }));
            onApplyTemplate();
        }
    }, [dispatch, onApplyTemplate, template.templateId]);

    return (
        <ThemedPressable onPress={handleApplyTemplate} padding round>
            <TemplateCardContent template={template} />
        </ThemedPressable>
    );
};
