import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import {
  getAppInstallDate,
  getHistoryByMonth,
  getLanguage,
  getLatestWorkoutDate,
  getWorkoutDates,
} from "../../../store/selectors";
import { useTheme } from "../../../theme/context";
import { CalendarList, DateData } from "react-native-calendars";
import {
  ThemedButtomSheetModal,
  useBottomSheetRef,
} from "../../../components/BottomSheetModal/ThemedButtomSheetModal";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { styles } from "../../../components/App/history/styles";
import { AppState } from "../../../store/types";
import { IsoDate } from "../../../types/date";
import { getDate, getDateToday, getDateTodayIso } from "../../../utils/date";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Temporal } from "@js-temporal/polyfill";
import { FlatList } from "react-native";
import { getDuration } from "../../../utils/getDuration";
import { ThemedMaterialCommunityIcons } from "../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { VStack } from "../../../components/Stack/VStack/VStack";

const useMarkedDates = () => {
  const { mainColor } = useTheme();
  const defaultMarkedDatesStyle = useMemo(
    () => ({ selected: true, selectedColor: mainColor, selectedTextColor: "black" }),
    [mainColor],
  );
  const dates = useAppSelector(getWorkoutDates);
  return [Object.fromEntries(dates.map((date) => [date, defaultMarkedDatesStyle]))] as const;
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
  const pastScrollRange = useMemo(
    () => Math.floor(getDateToday().since(installDate ?? getDateTodayIso()).days / 30),
    [installDate],
  );

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
    ({ item: { weight, date, name, duration } }: { item: (typeof dateData)[number] }) => (
      <ThemedView style={styles.workout} key={name.concat(date)}>
        <Text style={styles.workoutTitle}>{name}</Text>
        <VStack style={styles.displayedWorkoutWrapper}>
          <HStack style={styles.hstack}>
            <ThemedMaterialCommunityIcons name="calendar" size={20} />
            <Text>{getDate(date, lang, "long")}</Text>
          </HStack>
          <HStack style={styles.hstack}>
            <ThemedMaterialCommunityIcons name="weight" size={20} />
            <Text>{weight} kg</Text>
          </HStack>
          <HStack style={styles.hstack}>
            <ThemedMaterialCommunityIcons name="clock" size={20} />
            <Text>{getDuration(duration)}</Text>
          </HStack>
        </VStack>
      </ThemedView>
    ),
    [lang],
  );

  return (
    <ThemedView stretch>
      <SiteNavigationButtons
        titleFontSize={30}
        handleBack={handleNavigateBack}
        title={t("history")}
      />
      <PageContent style={styles.pageWrapper}>
        <Text style={styles.title} ghost>
          {month}
        </Text>
        <FlatList
          horizontal={false}
          data={dateData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          columnWrapperStyle={styles.scrollView}
          renderItem={renderItem}
          numColumns={2}
        />
        <ThemedPressable style={styles.browseButtonWrapper} onPress={open}>
          <Text style={styles.browseButton}>Browse History</Text>
        </ThemedPressable>
      </PageContent>
      <ThemedButtomSheetModal snapPoints={["50%"]} ref={ref}>
        <CalendarList
          futureScrollRange={0}
          pastScrollRange={pastScrollRange}
          maxDate={"2023-12-15"}
          minDate={installDate}
          showScrollIndicator
          onDayPress={handleSelectDate}
          theme={calendarTheme}
          disabledByDefault
          horizontal
          markedDates={markedDates}
        />
      </ThemedButtomSheetModal>
    </ThemedView>
  );
}
