import { SortingButton } from "../../../SortingButton/SortingButton";
import { useSorting } from "../../../../hooks/useSorting";
import { useAppSelector } from "../../../../store";
import { getWorkouts } from "../../../../store/reducers/workout/workoutSelectors";

export const WorkoutSorting = () => {
    const { title, iconName, mappedSorting } = useSorting();
    const numberOfWorkouts = useAppSelector(getWorkouts).length;
    return <SortingButton hide={numberOfWorkouts <= 1} iconName={iconName} title={title} mappedOptions={mappedSorting} />;
};
