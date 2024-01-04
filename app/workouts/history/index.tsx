import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { AppState, useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useTheme } from "../../../theme/context";
import { CalendarList, DateData } from "react-native-calendars";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedBottomSheetModal";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { styles } from "../../../components/App/history/styles";
import { IsoDate } from "../../../types/date";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Dimensions, SectionList, SectionListData, View, ViewStyle } from "react-native";
import { getDuration } from "../../../utils/getDuration";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { RenderedDay } from "../../../components/App/history/RenderedDay/RenderedDay";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { getEditedWorkout, getFirstWorkoutDate, getHistoryByMonth, getLatestWorkoutDate, getSortedDoneWorkout, getWorkoutColor } from "../../../store/reducers/workout/workoutSelectors";
import { getWeightUnit } from "../../../store/reducers/settings/settingsSelectors";
import { getTitle } from "../../../utils/date";
import { Chip } from "../../../components/Chip/Chip";

export type SectionListItemInfo = { color: string; name: string; doneWorkouts: { weight: string; numExercisesDone: number; duration?: string }[]; date: IsoDate };

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
const useScrollRanges = (selectedDate: IsoDate) => {
    const editedWorkout = useAppSelector(getEditedWorkout);
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDate(state, editedWorkout?.index ?? 0));
    const firstWorkoutDate = useAppSelector((state: AppState) => getFirstWorkoutDate(state, editedWorkout?.index ?? 0));
    const pastScrollRange = useMemo(() => monthDiff(new Date(firstWorkoutDate), new Date(selectedDate)), [firstWorkoutDate, selectedDate]);
    const futureScrollRange = useMemo(() => monthDiff(new Date(selectedDate), new Date(latestWorkoutDate)), [latestWorkoutDate, selectedDate]);

    return useMemo(() => ({ past: pastScrollRange, future: futureScrollRange }), [pastScrollRange, futureScrollRange]);
};

export function WorkoutHistory() {
    const { t } = useTranslation();
    const { inputFieldBackgroundColor, mainColor, textDisabled } = useTheme();
    const editedWorkout = useAppSelector(getEditedWorkout);
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDate(state, editedWorkout?.index ?? 0));
    const [selectedDate, setSelectedDate] = useState<IsoDate>(latestWorkoutDate);
    const { past, future } = useScrollRanges(selectedDate);
    const markedDates = useMarkedDates(editedWorkout?.index);
    const workout = useAppSelector(getEditedWorkout);
    const [ref, open, close] = useBottomSheetRef();
    const sectionListRef = useRef<SectionList>(null);
    const dateData = useAppSelector((state: AppState) => getHistoryByMonth(state, selectedDate));
    const navigate = useNavigate();
    const weightUnit = useAppSelector(getWeightUnit);

    useEffect(() => {
        setSelectedDate(latestWorkoutDate);
    }, [latestWorkoutDate]);

    const calendarTheme = useMemo(
        () => ({
            backgroundColor: inputFieldBackgroundColor,
            calendarBackground: inputFieldBackgroundColor,
            textSectionTitleColor: mainColor,
            disabledArrowColor: textDisabled,
            todayTextColor: "#00adf5",
            dayTextColor: mainColor,
            arrowColor: mainColor,
            textDisabledColor: textDisabled,
            textSectionTitleDisabledColor: mainColor,
            monthTextColor: mainColor,
        }),
        [inputFieldBackgroundColor, mainColor, textDisabled],
    );

    const handleNavigateBack = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    const handleSelectDate = useCallback(
        (date: IsoDate) => {
            setSelectedDate(date);
            close();
        },
        [close],
    );

    const renderItem = useCallback(
        ({ item }: { item: SectionListItemInfo }) => {
            if (item === undefined) {
                return <ThemedView key="GHOST" ghost stretch style={styles.workout} />;
            }
            const { color, date, name, doneWorkouts } = item;
            const selected = date === selectedDate;
            const workoutWrapperStyles: ViewStyle = { ...styles.workout, borderColor: selected ? color : "transparent" };
            return (
                <ThemedView input style={workoutWrapperStyles} key={name.concat(date)}>
                    {doneWorkouts.map(({ weight, duration, numExercisesDone }, index) => (
                        <HStack key={Math.random() * 1000} ghost style={styles.displayedWorkoutWrapper}>
                            <HStack ghost style={styles.hstack}>
                                <ThemedMaterialCommunityIcons ghost name="weight" size={20} />
                                <Text ghost>
                                    {weight} {weightUnit}
                                </Text>
                            </HStack>
                            <HStack ghost style={styles.hstack}>
                                <ThemedMaterialCommunityIcons ghost name="clock" size={20} />
                                <Text ghost>{getDuration(duration)}</Text>
                            </HStack>
                            <HStack ghost style={styles.hstack}>
                                <ThemedMaterialCommunityIcons ghost name="weight-lifter" size={20} />
                                <Text ghost>{numExercisesDone}</Text>
                            </HStack>
                        </HStack>
                    ))}
                </ThemedView>
            );
        },
        [selectedDate, weightUnit],
    );

    const dayComponent = useCallback(
        (date: DayProps & { date?: DateData | undefined }) => {
            if (!date.date?.dateString || !date.date?.day) {
                return null;
            }

            const day = date.date?.day.toString();
            const isoDate = date?.date?.dateString as IsoDate;
            const scrollCallback = () => {
                const possibleIndexToScrollTo = sectionListRef.current?.props.sections.findIndex((data) => data.data[0].date === isoDate);
                const indexToScrollTo = possibleIndexToScrollTo !== undefined && possibleIndexToScrollTo !== -1 ? possibleIndexToScrollTo : 0;

                sectionListRef.current?.scrollToLocation({
                    sectionIndex: indexToScrollTo,
                    itemIndex: 1,
                    viewOffset: Dimensions.get("window").height * 0.28,
                    animated: true,
                });
            };
            const handleDayPress = () => {
                handleSelectDate(isoDate);
                setTimeout(scrollCallback, 200);
            };

            const color = markedDates[isoDate];
            const isLatest = isoDate === latestWorkoutDate;
            return <RenderedDay latestDay={isLatest} selected={selectedDate === isoDate} handleSelectDate={handleDayPress} day={day} color={color} />;
        },
        [handleSelectDate, latestWorkoutDate, markedDates, selectedDate],
    );

    const renderSectionHeader = useCallback(
        ({ section }: { section: SectionListData<SectionListItemInfo> }) => {
            const date = section.title as IsoDate;
            const isLatestDate = date === latestWorkoutDate;
            return (
                <HStack background>
                    <Text background style={styles.title}>
                        {getTitle(date)}
                    </Text>
                    {isLatestDate && (
                        <View style={styles.latestWorkoutChip}>
                            <Chip type="Info" title={t("history_latest_workout")} />
                        </View>
                    )}
                </HStack>
            );
        },
        [latestWorkoutDate, t],
    );

    return (
        <ThemedView stretch>
            <SiteNavigationButtons handleBack={handleNavigateBack} title={t("history_front").concat(" ", workout?.workout.name ?? "")} />
            <PageContent background stretch safeBottom style={styles.pageWrapper}>
                <SectionList
                    ref={sectionListRef}
                    horizontal={false}
                    sections={dateData}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                />
                <ThemedPressable style={styles.browseButtonWrapper} onPress={open}>
                    <Text style={styles.browseButton}>{t("history_browse")}</Text>
                </ThemedPressable>
            </PageContent>
            <ThemedBottomSheetModal snapPoints={["50%"]} ref={ref}>
                <CalendarList
                    current={selectedDate ?? latestWorkoutDate}
                    dayComponent={dayComponent}
                    futureScrollRange={future}
                    pastScrollRange={past}
                    showScrollIndicator
                    theme={calendarTheme}
                    disabledByDefault
                    horizontal
                />
            </ThemedBottomSheetModal>
        </ThemedView>
    );
}
