import { SortingButton } from "../SortingButton/SortingButton";
import { useSorting } from "../../hooks/useSorting";

type SortingProps = {
    type: "Workout" | "Measurement";
    hide?: boolean;
};

export const Sorting = ({ type, hide }: SortingProps) => {
    const { title, iconName, mappedSorting } = useSorting({ type });
    return <SortingButton hide={hide} iconName={iconName} title={title} mappedOptions={mappedSorting} />;
};
