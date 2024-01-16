import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useCallback, useMemo } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getEditedMeasurement } from "../../../store/reducers/measurements/measurementSelectors";
import { PageContent } from "../../../components/PageContent/PageContent";
import { SelectableMeasurementDataPoint } from "../../../components/App/measurements/SelectableMeasurementDataPoint/SelectableMeasurementDataPoint";
import { FlatList, ListRenderItem } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MeasurementDataPoint } from "../../../components/App/measurements/types";
import { setDatapointIndexInEditedExercise } from "../../../store/reducers/measurements";

export const MeasurementHistory = () => {
    const navigate = useNavigate();
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    const { bottom } = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const handleNavigateToMeasurements = useCallback(() => {
        navigate("measurements");
    }, [navigate]);

    const handleEditMeasurementPoint = useCallback(
        (index: number) => {
            dispatch(setDatapointIndexInEditedExercise(index));
            navigate("measurement/create");
        },
        [dispatch, navigate],
    );

    const renderItem: ListRenderItem<MeasurementDataPoint> = useCallback(
        ({ item: { isoDate, value }, index }) => (
            <SelectableMeasurementDataPoint selectMeasurementPoint={() => handleEditMeasurementPoint(index)} type={editedMeasurement?.measurement.type} isoDate={isoDate} value={value} />
        ),
        [editedMeasurement?.measurement.type, handleEditMeasurementPoint],
    );

    const flatlistConfig = useMemo(() => {
        return {
            contentInset: { bottom: bottom * 2 },
            contentContainerStyle: { gap: 10 },
            columnWrapperStyle: { gap: 10 },
        };
    }, [bottom]);

    if (editedMeasurement === undefined) {
        navigate("measurements");
        return null;
    }

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons handleBack={handleNavigateToMeasurements} title={editedMeasurement.measurement.name} />
            <PageContent ghost paddingTop={20}>
                <FlatList
                    contentInset={flatlistConfig.contentInset}
                    contentContainerStyle={flatlistConfig.contentContainerStyle}
                    numColumns={3}
                    columnWrapperStyle={flatlistConfig.columnWrapperStyle}
                    data={editedMeasurement.measurement.data}
                    renderItem={renderItem}
                />
            </PageContent>
        </ThemedView>
    );
};
