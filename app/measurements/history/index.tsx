import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getDatesFromCurrentMeasurement, getEditedMeasurement, getUnitByType } from "../../../store/reducers/measurements/measurementSelectors";
import { PageContent } from "../../../components/PageContent/PageContent";
import { SelectableMeasurementDataPoint } from "../../../components/App/measurements/SelectableMeasurementDataPoint/SelectableMeasurementDataPoint";
import { FlatList, Keyboard, ListRenderItem } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MeasurementDataPoint } from "../../../components/App/measurements/types";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { convertDate, getDateTodayIso, getLocaleDate } from "../../../utils/date";
import { getLanguage, getThemeKey, getUnitSystem } from "../../../store/reducers/settings/settingsSelectors";
import { useTranslation } from "react-i18next";
import { EditableExerciseInputRow } from "../../../components/EditableExercise/EditableExerciseInputRow";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { saveMeasurementDataPoint } from "../../../store/reducers/measurements";
import { createStyles } from "../../../components/App/measurements/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAppInstallDate } from "../../../store/reducers/metadata/metadataSelectors";
import { useTheme } from "../../../theme/context";

const MAX_DATE = new Date(getDateTodayIso());

export const MeasurementHistory = () => {
    const navigate = useNavigate();
    const editedMeasurement = useAppSelector(getEditedMeasurement);
    const { bottom } = useSafeAreaInsets();

    const [ref, open, close] = useBottomSheetRef();
    const [editedDatapoint, setEditedDatapoint] = useState<(MeasurementDataPoint & { index: number }) | undefined>();
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    const unitSystem = useAppSelector(getUnitSystem);
    const dispatch = useAppDispatch();
    const installDate = useAppSelector(getAppInstallDate);
    const minimiumDate = useMemo(() => new Date(installDate ?? "2023-01-01"), [installDate]);
    const { mainColor } = useTheme();
    const themeKey = useAppSelector(getThemeKey);
    const measurementDates = useAppSelector(getDatesFromCurrentMeasurement);

    const handleEditMeasurementPoint = useCallback(
        (index: number) => {
            if (editedMeasurement?.measurement) {
                setEditedDatapoint({ ...editedMeasurement?.measurement.data[index], index });
                open();
            }
        },
        [editedMeasurement?.measurement, open],
    );

    const handleNavigateToMeasurements = useCallback(() => {
        navigate("measurements");
    }, [navigate]);

    const renderItem: ListRenderItem<MeasurementDataPoint> = useCallback(
        ({ item: { isoDate, value }, index }) => (
            <SelectableMeasurementDataPoint selectMeasurementPoint={() => handleEditMeasurementPoint(index)} type={editedMeasurement?.measurement?.type} isoDate={isoDate} value={value} />
        ),
        [editedMeasurement?.measurement?.type, handleEditMeasurementPoint],
    );

    const flatlistConfig = useMemo(() => {
        return {
            contentInset: { bottom: bottom * 2 },
            contentContainerStyle: { gap: 10 },
            columnWrapperStyle: { gap: 10 },
        };
    }, [bottom]);

    const title = useMemo(
        () => editedDatapoint?.isoDate && `${editedMeasurement?.measurement?.name} ${t("on")} ${getLocaleDate(editedDatapoint?.isoDate, language, { dateStyle: "medium" })}`,
        [editedDatapoint?.isoDate, editedMeasurement?.measurement?.name, language, t],
    );

    const unit = useMemo(() => {
        return getUnitByType(unitSystem, editedMeasurement?.measurement?.type);
    }, [editedMeasurement?.measurement?.type, unitSystem]);

    const handleSaveEditedDatapoint = useCallback(() => {
        dispatch(saveMeasurementDataPoint({ datapoint: editedDatapoint, index: editedDatapoint?.index }));
        Keyboard.dismiss();
        close();
    }, [close, dispatch, editedDatapoint]);

    const handleSetDatapointValue = useCallback(
        (value?: string) => {
            if (editedDatapoint === undefined) return;
            setEditedDatapoint({ isoDate: editedDatapoint.isoDate, value: value ?? "0", index: editedDatapoint.index });
        },
        [editedDatapoint],
    );

    const handleSetDatapointDate = useCallback(
        (_: unknown, selectedDate?: Date) => {
            if (selectedDate === undefined || editedDatapoint?.index === undefined) {
                return;
            }
            const isoDate = convertDate.toIsoDate(selectedDate);

            if (measurementDates?.includes(isoDate)) {
                //todo add warning
                console.log("already in use");
            } else {
                setEditedDatapoint({ isoDate: convertDate.toIsoDate(selectedDate), value: editedDatapoint?.value ?? "0", index: editedDatapoint.index });
            }
        },
        [editedDatapoint?.index, editedDatapoint?.value, measurementDates],
    );

    if (editedMeasurement === undefined) {
        navigate("measurements");
        return null;
    }

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons handleBack={handleNavigateToMeasurements} title={editedMeasurement.measurement?.name} />
            <PageContent ghost paddingTop={20}>
                <FlatList
                    contentInset={flatlistConfig.contentInset}
                    contentContainerStyle={flatlistConfig.contentContainerStyle}
                    numColumns={3}
                    columnWrapperStyle={flatlistConfig.columnWrapperStyle}
                    data={editedMeasurement.measurement?.data}
                    renderItem={renderItem}
                />
            </PageContent>

            <ThemedBottomSheetModal snapPoints={["70%"]} title={title} ref={ref}>
                <PageContent safeBottom ghost stretch paddingTop={20}>
                    <EditableExerciseInputRow suffix={unit} setValue={handleSetDatapointValue} value={editedDatapoint?.value}></EditableExerciseInputRow>
                    <DateTimePicker
                        display="inline"
                        maximumDate={MAX_DATE}
                        minimumDate={minimiumDate}
                        locale={language}
                        accentColor={mainColor}
                        themeVariant={themeKey}
                        style={createStyles.calendar}
                        onChange={handleSetDatapointDate}
                        value={convertDate.toDate(editedDatapoint?.isoDate ?? getDateTodayIso())}
                    />
                    <ThemedPressable padding round onPress={handleSaveEditedDatapoint}>
                        <Text>Confirm Change</Text>
                    </ThemedPressable>
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
