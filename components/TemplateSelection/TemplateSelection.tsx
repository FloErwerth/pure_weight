import { RefObject, useCallback, useMemo, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { useAppSelector } from "../../store";
import { getSavedTemplates } from "../../store/reducers/workout/workoutSelectors";
import { PageContent } from "../PageContent/PageContent";
import { TemplateCard } from "./Template/Card";
import { Searchbar } from "../Searchbar/Searchbar";

type TemplateSelectionProps = {
    reference: RefObject<BottomSheetModal>;
    onApplyTemplate: () => void;
};

export const TemplateSelection = ({ reference, onApplyTemplate }: TemplateSelectionProps) => {
    const savedTemplates = useAppSelector(getSavedTemplates);
    const [search, setSearch] = useState("");

    const filteredTemplates = useMemo(() => savedTemplates?.filter((template) => template.exerciseMetaData.name.toLowerCase().includes(search.toLowerCase())), [savedTemplates, search]);
    const resetFilter = useCallback(() => setSearch(""), []);

    const handleApplytemplate = useCallback(() => {
        resetFilter();
        onApplyTemplate();
    }, [onApplyTemplate, resetFilter]);

    const mappedTemplates = useMemo(
        () => filteredTemplates?.map((template) => <TemplateCard onApplyTemplate={handleApplytemplate} key={template.templateId} template={template} />),
        [filteredTemplates, handleApplytemplate],
    );

    return (
        <ThemedBottomSheetModal ref={reference} onRequestClose={resetFilter} snapPoints={["100%"]}>
            <PageContent ghost>
                <Searchbar handleSetSearchManual={setSearch} />
            </PageContent>
            <PageContent ghost scrollable>
                {mappedTemplates}
            </PageContent>
        </ThemedBottomSheetModal>
    );
};
