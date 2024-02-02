import { WeightBasedEditableTemplate } from "./Content/WeightBasedEditableTemplate";
import { TimeBasedEditableTemplate } from "./Content/TimeBasedEditableTemplate";
import { useAppSelector } from "../../store";
import { getEditedExerciseTemplate } from "../../store/reducers/workout/workoutSelectors";

export const EditableTemplate = () => {
    const editedTemplate = useAppSelector(getEditedExerciseTemplate);
    if (editedTemplate?.exerciseMetaData.type === "WEIGHT_BASED") {
        return <WeightBasedEditableTemplate />;
    }

    return <TimeBasedEditableTemplate />;
};
