import { styles } from "./styles";
import { ProfileContent } from "../SettingsSection/ProfileSection";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { useCallback } from "react";

import { SelectableSetting } from "../../SelectableSetting/SelectableSetting";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { setEmptyState, setMockState } from "../../../../../store/reducers/metadata";
import { getStateType } from "../../../../../store/reducers/metadata/metadataSelectors";

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
            <ThemedView style={styles.vStack}>
                <SelectableSetting selected={stateType === "mock"} onSelect={handleSelectMockState} titleKey="Mock state" />
                <SelectableSetting selected={stateType === "empty"} onSelect={handleSelectEmptyState} titleKey="Empty state" />
            </ThemedView>
        </ProfileContent>
    );
};
