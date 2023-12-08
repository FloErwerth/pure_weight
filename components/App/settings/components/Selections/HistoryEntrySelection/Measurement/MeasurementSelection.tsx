import { HStack } from "../../../../../../Stack/HStack/HStack";
import { SelectableSetting } from "../../../../SelectableSetting/SelectableSetting";
import { VStack } from "../../../../../../Stack/VStack/VStack";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import { getNumberMeasurementEntries } from "../../../../../../../store/reducers/settings/settingsSelectors";
import { useCallback } from "react";
import { setNumberMeasurementEntries } from "../../../../../../../store/reducers/settings";

type MeasurementSelectionProps = {
    insideModal?: boolean;
    onSelect?: () => void;
};

export const MeasurementSelection = ({ insideModal, onSelect }: MeasurementSelectionProps) => {
    const dispatch = useAppDispatch();
    const numberMeasurementEntries = useAppSelector(getNumberMeasurementEntries);

    const handleSelect10Enries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberMeasurementEntries("10"));
    }, [dispatch, onSelect]);

    const handleSelect25Enries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberMeasurementEntries("25"));
    }, [dispatch, onSelect]);

    const handleSelect100Enries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberMeasurementEntries("100"));
    }, [dispatch, onSelect]);

    const handleSelectAllEnries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberMeasurementEntries("ALL"));
    }, [dispatch, onSelect]);

    return (
        <VStack ghost={insideModal} style={{ gap: 5, margin: insideModal ? 10 : 0 }}>
            <HStack ghost={insideModal} style={{ gap: 5 }}>
                <SelectableSetting stretch titleKey="10" onSelect={handleSelect10Enries} selected={numberMeasurementEntries === "10"} />
                <SelectableSetting stretch titleKey="25" onSelect={handleSelect25Enries} selected={numberMeasurementEntries === "25"} />
                <SelectableSetting stretch titleKey="100" onSelect={handleSelect100Enries} selected={numberMeasurementEntries === "100"} />
            </HStack>
            <SelectableSetting titleKey={"settings_measurement_history_all"} onSelect={handleSelectAllEnries} selected={numberMeasurementEntries === "ALL"} />
        </VStack>
    );
};
