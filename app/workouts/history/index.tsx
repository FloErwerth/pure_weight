import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useTheme } from "../../../theme/context";
import { CalendarList, DateData } from "react-native-calendars";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { styles } from "../../../components/App/history/styles";
import { IsoDate } from "../../../types/date";
import { Dimensions, FlatList } from "react-native";
import { RenderedDay } from "../../../components/App/history/RenderedDay/RenderedDay";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { getEditedWorkout, getFirstWorkoutDate, getLatestWorkoutDate, getSortedDoneWorkout, getWorkoutColor, getWorkoutsByMonth } from "../../../store/reducers/workout/workoutSelectors";
import { noop } from "lodash";
import { WorkoutHistoryCard } from "../../../components/WorkoutHistoryCard/WorkoutHistoryCard";
import { getDateTodayIso } from "../../../utils/date";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { saveEditedWorkout } from "../../../store/reducers/workout";

export type FlatListData = {
    doneWorkoutId: number;
    handleEdit?: () => void;
    name: string;
    date: IsoDate;
    marked: boolean;
};

const useMarkedDates = (index?: number) => {
    const { mainColor } = useTheme();
    const timestamps = useAppSelector((state: AppState) => getSortedDoneWorkout(state, index ?? 0));
    const color = useAppSelector(getWorkoutColor);
    return useMemo(
        () =>
            timestamps?.reduce(
                (markedDates, date) => {
                    return { ...markedDates, [date]: color ?? mainColor };
                },
                {} as Record<IsoDate, string>,
            ),
        [color, timestamps, mainColor],
    );
};

function monthDiff(d1: Date, d2: Date) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

const useScrollRanges = (selectedDate?: IsoDate) => {
    const editedWorkout = useAppSelector(getEditedWorkout);
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDate(state, editedWorkout?.workout?.workoutId ?? 0));
    const firstWorkoutDate = useAppSelector((state: AppState) => getFirstWorkoutDate(state, editedWorkout?.workout?.workoutId ?? 0));
    const dateToday = getDateTodayIso();
    const pastScrollRange = useMemo(() => monthDiff(new Date(firstWorkoutDate), new Date(selectedDate ?? dateToday)), [selectedDate, dateToday, firstWorkoutDate]);
    const futureScrollRange = useMemo(() => monthDiff(new Date(selectedDate ?? dateToday), new Date(latestWorkoutDate)), [selectedDate, dateToday, latestWorkoutDate]);
    return useMemo(() => ({ past: pastScrollRange, future: futureScrollRange }), [pastScrollRange, futureScrollRange]);
};

export function WorkoutHistory() {
    const { t } = useTranslation();
    const { mainColor, textDisabled } = useTheme();
    const editedWorkout = useAppSelector(getEditedWorkout);
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDate(state, editedWorkout?.workout.workoutId ?? 0));
    const [selectedDate, setSelectedDate] = useState<IsoDate>(latestWorkoutDate);
    const { past, future } = useScrollRanges(selectedDate);
    const markedDates = useMarkedDates(editedWorkout?.workout.workoutId);
    const workout = useAppSelector(getEditedWorkout);
    const [ref, open, close] = useBottomSheetRef();
    const sectionListRef = useRef<FlatList>(null);
    const workoutsInMonth = useAppSelector((state: AppState) => getWorkoutsByMonth(state, selectedDate));
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSelectedDate(latestWorkoutDate);
    }, [latestWorkoutDate]);

    const calendarTheme = useMemo(
        () => ({
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "transparent",
            disabledArrowColor: "transparent",
            todayTextColor: "#00adf5",
            dayTextColor: mainColor,
            arrowColor: mainColor,
            textDisabledColor: textDisabled,
            textSectionTitleDisabledColor: mainColor,
            monthTextColor: mainColor,
        }),
        [mainColor, textDisabled],
    );

    const handleNavigateBack = useCallback(() => {
        dispatch(saveEditedWorkout());
        navigate("workouts");
    }, [dispatch, navigate]);

    const handleSelectDate = useCallback(
        (date: IsoDate) => {
            setSelectedDate(date);
            close();
        },
        [close],
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
                <WorkoutHistoryCard key={Math.random() * doneWorkoutId} marked={marked} date={date} doneWorkoutId={doneWorkoutId} onEdit={handleEdit} />
            </ThemedView>
        );
    }, []);

    const dayComponent = useCallback(
        ({ date }: DayProps & { date?: DateData | undefined }) => {
            if (!date?.dateString || !date?.day) {
                return null;
            }

            const day = date?.day.toString();
            const isoDate = date?.dateString as IsoDate;
            const scrollCallback = () => {
                if ((sectionListRef.current?.props.data as Array<FlatListData>)?.findIndex) {
                    const possibleIndexToScrollTo = (sectionListRef.current?.props.data as Array<FlatListData>).findIndex((data: FlatListData) => data.date === isoDate);
                    const indexToScrollTo = possibleIndexToScrollTo !== undefined && possibleIndexToScrollTo !== -1 ? possibleIndexToScrollTo : 0;
                    sectionListRef.current?.scrollToIndex({
                        index: indexToScrollTo,
                        viewOffset: Dimensions.get("window").height * 0.28,
                        animated: true,
                    });
                }
            };

            const handleDayPress = () => {
                handleSelectDate(isoDate);
                setTimeout(scrollCallback, 200);
            };

            const color = markedDates?.[isoDate];
            const isLatest = isoDate === latestWorkoutDate;
            return <RenderedDay latestDay={isLatest} selected={selectedDate === isoDate} handleSelectDate={handleDayPress} day={day} color={color} />;
        },
        [handleSelectDate, latestWorkoutDate, markedDates, selectedDate],
    );

    return (
        <ThemedView stretch>
            <SiteNavigationButtons handleBack={handleNavigateBack} title={t("history_front").concat(" ", workout?.workout?.name ?? "")} />
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
                <ThemedPressable style={styles.browseButtonWrapper} onPress={open}>
                    <Text style={styles.browseButton}>{t("history_browse")}</Text>
                </ThemedPressable>
                <ThemedBottomSheetModal snapPoints={["55%"]} ref={ref}>
                    <CalendarList
                        onScrollToIndexFailed={noop}
                        current={selectedDate ?? latestWorkoutDate}
                        dayComponent={dayComponent}
                        futureScrollRange={future}
                        pastScrollRange={past}
                        showScrollIndicator={false}
                        theme={calendarTheme}
                        horizontal
                    />
                </ThemedBottomSheetModal>
            </PageContent>
        </ThemedView>
    );
}
