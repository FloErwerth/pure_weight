import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { AppState, useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useTheme } from "../../../theme/context";
import { CalendarList, DateData } from "react-native-calendars";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedButtomSheetModal";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { styles } from "../../../components/App/history/styles";
import { IsoDate } from "../../../types/date";
import { getDateToday, getDateTodayIso, getMonth, getTitle } from "../../../utils/date";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Dimensions, SectionList, SectionListData, ViewStyle } from "react-native";
import { getDuration } from "../../../utils/getDuration";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { RenderedDay } from "../../../components/App/history/RenderedDay/RenderedDay";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { borderRadius } from "../../../theme/border";
import { getAppInstallDate } from "../../../store/reducers/metadata/metadataSelectors";
import {
    getHistoryByMonth,
    getLatestWorkoutDate,
    getSelectedTrainingDay,
    getWorkoutColor,
    getWorkoutDates,
} from "../../../store/reducers/workout/workoutSelectors";

export type SectionListItemInfo = { color: string; name: string; duration?: string; date: IsoDate; weight: number; numExercisesDone: number };
export type MarkedDay = {
    selectedColor: string;
};

const useMarkedDates = () => {
    const { mainColor } = useTheme();
    const dates = useAppSelector(getWorkoutDates);
    const color = useAppSelector(getWorkoutColor);
    return useMemo(
        () =>
            dates?.reduce(
                (markedDates, date) => {
                    return { ...markedDates, [date]: color ?? mainColor };
                },
                {} as Record<IsoDate, string>,
            ),
        [color, dates, mainColor],
    );
};

export function WorkoutHistory() {
    const { t } = useTranslation();
    const { inputFieldBackgroundColor, mainColor, textDisabled } = useTheme();
    const installDate = useAppSelector(getAppInstallDate);
    const latestWorkoutDate = useAppSelector(getLatestWorkoutDate);
    const [selectedDate, setSelectedDate] = useState<IsoDate | undefined>();
    const pastScrollRange = useMemo(() => Math.floor(getDateToday().since(installDate ?? getDateTodayIso()).days / 30), [installDate]);
    const markedDates = useMarkedDates();
    const workout = useAppSelector(getSelectedTrainingDay);
    const [ref, open, close] = useBottomSheetRef();
    const sectionListRef = useRef<SectionList>(null);
    const dateData = useAppSelector((state: AppState) => getHistoryByMonth(state, selectedDate));
    const navigate = useNavigate();

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
        navigate("profile");
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
            const { color, weight, date, name, duration, numExercisesDone } = item;
            const selected = date === selectedDate;
            const workoutWrapperStyles: ViewStyle = { ...styles.workout, borderColor: selected ? color : "transparent" };
            return (
                <ThemedView
                    input
                    style={workoutWrapperStyles}
                    key={name
                        .concat(date)
                        .concat(weight.toString())
                        .concat(numExercisesDone.toString())
                        .concat(duration ?? "DURATION")}
                >
                    <HStack ghost style={styles.displayedWorkoutWrapper}>
                        <HStack ghost style={styles.hstack}>
                            <ThemedMaterialCommunityIcons ghost name="weight" size={20} />
                            <Text ghost>{weight} kg</Text>
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
                </ThemedView>
            );
        },
        [mainColor, selectedDate],
    );

    const dayComponent = useCallback(
        (date: DayProps & { date?: DateData | undefined }) => {
            const day = date.date?.day.toString();
            const isoDate = date?.date?.dateString as IsoDate;

            if (!day || !isoDate) {
                return null;
            }

            const scrollCallback = () => {
                sectionListRef.current?.scrollToLocation({
                    sectionIndex: sectionListRef.current?.props.sections.findIndex((data) => data.data[0].date === isoDate),
                    itemIndex: 1,
                    viewOffset: Dimensions.get("window").height * 0.28,
                    animated: true,
                });
            };
            const differentMonth = getMonth(isoDate) !== getMonth(selectedDate);
            const handleDayPress = () => {
                handleSelectDate(isoDate);
                if (differentMonth) {
                    setTimeout(scrollCallback, 50);
                    return;
                }
                scrollCallback();
            };

            const color = markedDates[isoDate];
            return <RenderedDay selected={selectedDate === isoDate} handleSelectDate={handleDayPress} day={day} color={color} />;
        },
        [handleSelectDate, markedDates, selectedDate],
    );

    const renderSectionHeader = useCallback(({ section }: { section: SectionListData<SectionListItemInfo> }) => {
        const date = section.title as IsoDate;
        return (
            <Text background style={{ fontSize: 26, padding: 1, flex: 1, borderRadius, marginTop: 20 }}>
                {getTitle(date)}
            </Text>
        );
    }, []);

    return (
        <ThemedView stretch>
            <SiteNavigationButtons handleBack={handleNavigateBack} title={t("history_front").concat(" ", workout?.name ?? "")} />
            <PageContent style={styles.pageWrapper}>
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
                    <Text style={styles.browseButton}>Browse History</Text>
                </ThemedPressable>
            </PageContent>
            <ThemedButtomSheetModal snapPoints={["50%"]} ref={ref}>
                <CalendarList
                    current={selectedDate ?? latestWorkoutDate}
                    dayComponent={dayComponent}
                    futureScrollRange={0}
                    pastScrollRange={pastScrollRange}
                    showScrollIndicator
                    theme={calendarTheme}
                    disabledByDefault
                    horizontal
                />
            </ThemedButtomSheetModal>
        </ThemedView>
    );
}
