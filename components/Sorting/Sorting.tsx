import { SortingButton } from "../SortingButton/SortingButton";
import { useSorting } from "../../hooks/useSorting";

type SortingProps = {
    hide?: boolean;
};

export const Sorting = ({ hide }: SortingProps) => {
    const { title, iconName, mappedSorting } = useSorting();
    return <SortingButton hide={hide} iconName={iconName} title={title} mappedOptions={mappedSorting} />;
};
