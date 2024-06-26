import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback } from "react";

import { SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { setEmptyState, setMockState } from "../../../../../../store/reducers/metadata";
import { getStateType } from "../../../../../../store/selectors/metadata/metadataSelectors";
import { selectionStyles } from "../../selectionStyles";
import { ProfileContent } from "../../ProfileContent/ProfileContent";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

export const DevelopmentSelection = () => {
    const dispatch = useAppDispatch();
    const stateType = useAppSelector(getStateType);

    const handleSelectMockState = useCallback(() => {
        dispatch(setMockState());
    }, [dispatch]);

    const handleSelectEmptyState = useCallback(() => {
        dispatch(setEmptyState());
    }, [dispatch]);

    return (
        <ProfileContent title={"Development"}>
            <ThemedView style={selectionStyles.vStack}>
                <SelectableSetting selected={stateType === "mock"} onSelect={handleSelectMockState} titleKey={"Mock state" as TranslationKeys} />
                <SelectableSetting selected={stateType === "empty"} onSelect={handleSelectEmptyState} titleKey={"Empty state" as TranslationKeys} />
            </ThemedView>
        </ProfileContent>
    );
};
