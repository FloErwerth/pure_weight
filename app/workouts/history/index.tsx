import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { styles } from "../../../components/App/history/styles";
import { IsoDate } from "../../../types/date";
import { FlatList } from "react-native";
import {
    getEditedWorkout,
    getLatestWorkoutDate,
    getSortedDoneWorkout,
    getWorkoutsByMonth,
} from "../../../store/reducers/workout/workoutSelectors";
import { noop } from "lodash";
import { WorkoutHistoryCard } from "../../../components/WorkoutHistoryCard/WorkoutHistoryCard";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { saveEditedWorkout } from "../../../store/reducers/workout";
import { WorkoutId } from "../../../store/reducers/workout/types";
import { DatePicker } from "../../../components/DatePicker/DatePicker";

export type FlatListData = {
    doneWorkoutId: WorkoutId;
    handleEdit?: () => void;
    name: string;
    date: IsoDate;
    marked: boolean;
};

export function WorkoutHistory() {
    const { t } = useTranslation();
    const editedWorkout = useAppSelector(getEditedWorkout);
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDate(state, editedWorkout?.workout.workoutId));
    const [selectedDate, setSelectedDate] = useState<IsoDate>(latestWorkoutDate);
    const doneWorkoutDates = useAppSelector((state: AppState) => getSortedDoneWorkout(state, editedWorkout?.workout?.workoutId));
    const workout = useAppSelector(getEditedWorkout);
    const { ref, openBottomSheet, closeBottomSheet } = useBottomSheetRef();
    const sectionListRef = useRef<FlatList>(null);
    const workoutsInMonth = useAppSelector((state: AppState) => getWorkoutsByMonth(state, selectedDate));
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSelectedDate(latestWorkoutDate);
    }, [latestWorkoutDate]);

    const handleNavigateBack = useCallback(() => {
        dispatch(saveEditedWorkout());
        navigate("workouts");
    }, [dispatch, navigate]);

    const handleSelectDate = useCallback(
        (date: IsoDate) => {
            setSelectedDate(date);
            closeBottomSheet();
        },
        [closeBottomSheet],
    );

    const mappedDateData = useMemo(() => {
        return workoutsInMonth?.map((section) => {
            const { doneWorkoutId, isoDate } = section;
            const handleEdit = () => {
                setSelectedDate(isoDate);
                navigate("workouts/history/edit/index", { doneWorkoutId });
            };
            const name = workout?.workout?.name ?? "";
            const marked = isoDate === selectedDate;
            return { handleEdit, date: isoDate, name, doneWorkoutId, marked };
        });
    }, [workoutsInMonth, workout?.workout?.name, selectedDate, navigate]);

    const renderItem = useCallback(({ item }: { item: FlatListData }) => {
        if (item === undefined) {
            return <ThemedView key="GHOST" ghost stretch style={styles.workout} />;
        }
        const { handleEdit, doneWorkoutId, date, marked } = item;
        return (
            <ThemedView ghost style={styles.workout}>
                <WorkoutHistoryCard key={Math.random()} marked={marked} date={date} doneWorkoutId={doneWorkoutId} onEdit={handleEdit} />
            </ThemedView>
        );
    }, []);

    const dateConfig = useMemo(() => {
        return doneWorkoutDates?.map((date) => {
            return {
                date,
                marked: true,
                selectable: true,
                latest: date === latestWorkoutDate,
            };
        });
    }, [doneWorkoutDates, latestWorkoutDate]);

    return (
        <ThemedView stretch>
            <SiteNavigationButtons
                backButtonAction={handleNavigateBack}
                title={t("history_front").concat(" ", workout?.workout?.name ?? "")}
            />
            <PageContent safeBottom background stretch>
                <FlatList
                    ref={sectionListRef}
                    horizontal={false}
                    data={mappedDateData}
                    showsVerticalScrollIndicator={false}
                    onScrollToIndexFailed={noop}
                    contentContainerStyle={styles.scrollView}
                    renderItem={renderItem}
                />
                <ThemedPressable style={styles.browseButtonWrapper} onPress={openBottomSheet}>
                    <Text style={styles.browseButton}>{t("history_browse")}</Text>
                </ThemedPressable>
                <ThemedBottomSheetModal ref={ref}>
                    <DatePicker selectedDate={selectedDate} handleSelectDate={handleSelectDate} dateConfig={dateConfig} />
                </ThemedBottomSheetModal>
            </PageContent>
        </ThemedView>
    );
}
