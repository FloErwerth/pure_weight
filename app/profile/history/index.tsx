import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { getAppInstallDate, getHistoryByMonth, getLanguage, getLatestWorkoutDate, getWorkoutDateColor } from "../../../store/selectors";
import { useTheme } from "../../../theme/context";
import { CalendarList, DateData } from "react-native-calendars";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedButtomSheetModal";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { styles } from "../../../components/App/history/styles";
import { AppState } from "../../../store/types";
import { IsoDate } from "../../../types/date";
import { getDateToday, getDateTodayIso, getTitle } from "../../../utils/date";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Temporal } from "@js-temporal/polyfill";
import { SectionList } from "react-native";
import { getDuration } from "../../../utils/getDuration";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ColorIndicator } from "../../../components/ColorIndicator/ColorIndicator";
import { RenderedDay } from "../../../components/App/history/RenderedDay/RenderedDay";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { borderRadius } from "../../../theme/border";

export type MarkedDay = {
  marked: boolean;
  selectedColor: string;
  selectedTextColor: string;
  dotColors: string[];
};

const useMarkedDates = () => {
  const { secondaryBackgroundColor, mainColor } = useTheme();
  const getMarkedDateStyle = useCallback(
    (colors?: string[]): MarkedDay => {
      return {
        marked: true,
        selectedColor: secondaryBackgroundColor,
        selectedTextColor: mainColor,
        dotColors: colors ?? [],
      };
    },
    [mainColor, secondaryBackgroundColor],
  );
  const dates = useAppSelector(getWorkoutDateColor);
  return [Object.fromEntries(dates.map(({ date, colors }) => [date, getMarkedDateStyle(colors)]))] as const;
};

export function WorkoutHistory() {
  const { t } = useTranslation();
  const { inputFieldBackgroundColor, mainColor, textDisabled } = useTheme();
  const installDate = useAppSelector(getAppInstallDate);
  const latestWorkoutDate = useAppSelector(getLatestWorkoutDate);
  const [date, setDate] = useState<IsoDate>(latestWorkoutDate);
  const lang = useAppSelector(getLanguage);
  const month = useMemo(
    () =>
      Temporal.PlainDate.from(date).toLocaleString(lang, {
        day: undefined,
        month: "long",
        year: "numeric",
      }),
    [date, lang],
  );
  const dateData = useAppSelector((state: AppState) => getHistoryByMonth(state, date));
  const pastScrollRange = useMemo(() => Math.floor(getDateToday().since(installDate ?? getDateTodayIso()).days / 30), [installDate]);

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

  const [markedDates] = useMarkedDates();
  const navigate = useNavigate();
  const handleNavigateBack = useCallback(() => {
    navigate("profile");
  }, [navigate]);
  const [ref, open, close] = useBottomSheetRef();

  const handleSelectDate = useCallback(
    ({ dateString }: DateData) => {
      setDate(dateString as IsoDate);
      close();
    },
    [close],
  );

  const renderItem = useCallback(
    ({ item }: { item: { color: string; weight: number; date: IsoDate; name: string; duration?: string; numExercisesDone: number } }) => {
      if (item === undefined) {
        return <ThemedView ghost stretch style={styles.workout} />;
      }
      const { color, weight, date, name, duration, numExercisesDone } = item;
      return (
        <ThemedView style={styles.workout} key={name.concat(date)}>
          <HStack>
            <HStack style={styles.titleWrapper}>
              <ColorIndicator color={color} width={3} height={20} />
              <Text style={styles.workoutTitle}>{name}</Text>
            </HStack>
          </HStack>
          <HStack style={styles.displayedWorkoutWrapper}>
            <HStack style={styles.hstack}>
              <ThemedMaterialCommunityIcons name="weight" size={20} />
              <Text>{weight} kg</Text>
            </HStack>
            <HStack style={styles.hstack}>
              <ThemedMaterialCommunityIcons name="clock" size={20} />
              <Text>{getDuration(duration)}</Text>
            </HStack>
            <HStack style={styles.hstack}>
              <ThemedMaterialCommunityIcons name="weight-lifter" size={20} />
              <Text>{numExercisesDone}</Text>
            </HStack>
          </HStack>
        </ThemedView>
      );
    },
    [],
  );

  const dayComponent = useCallback(
    (date: DayProps & { date?: DateData | undefined }) => {
      const day = date.date?.day.toString();
      const isoDate = date?.date?.dateString;

      if (!day || !isoDate) {
        return null;
      }
      const markedDay = markedDates[isoDate];
      return <RenderedDay day={day} markedDate={markedDay} />;
    },
    [markedDates],
  );

  return (
    <ThemedView stretch>
      <SiteNavigationButtons titleFontSize={30} handleBack={handleNavigateBack} title={t("history")} />
      <PageContent style={styles.pageWrapper}>
        <SectionList
          horizontal={false}
          sections={dateData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          renderItem={renderItem}
          renderSectionHeader={({ section }) => (
            <Text background style={{ fontSize: 26, padding: 1, flex: 1, borderRadius, marginTop: 20 }}>
              {getTitle(section.title as IsoDate)}
            </Text>
          )}
        />
        <ThemedPressable style={styles.browseButtonWrapper} onPress={open}>
          <Text style={styles.browseButton}>Browse History</Text>
        </ThemedPressable>
      </PageContent>
      <ThemedButtomSheetModal snapPoints={["50%"]} ref={ref}>
        <CalendarList
          dayComponent={dayComponent}
          futureScrollRange={0}
          pastScrollRange={pastScrollRange}
          showScrollIndicator
          onDayPress={handleSelectDate}
          theme={calendarTheme}
          disabledByDefault
          horizontal
        />
      </ThemedButtomSheetModal>
    </ThemedView>
  );
}
