import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { getAppInstallDate, getHistoryByDate, getLatestWorkoutDate, getWorkoutDates } from "../../../store/selectors";
import { useTheme } from "../../../theme/context";
import { CalendarList, DateData } from "react-native-calendars";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../../../components/BottomSheetModal/ThemedButtomSheetModal";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { styles } from "../../../components/App/history/styles";
import { AppState } from "../../../store/types";
import { IsoDate } from "../../../types/date";
import { getDate, getDateToday, getDateTodayIso } from "../../../utils/date";
import { HStack } from "../../../components/Stack/HStack/HStack";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";

const useMarkedDates = () => {
  const { mainColor } = useTheme();
  const defaultMarkedDatesStyle = useMemo(() => ({ selected: true, selectedColor: mainColor, selectedTextColor: "black" }), [mainColor]);
  const dates = useAppSelector(getWorkoutDates);
  return [Object.fromEntries(dates.map((date) => [date, defaultMarkedDatesStyle]))] as const;
};

export function WorkoutHistory() {
  const { t } = useTranslation();
  const { inputFieldBackgroundColor, mainColor, textDisabled } = useTheme();
  const installDate = useAppSelector(getAppInstallDate);
  const latestWorkoutDate = useAppSelector(getLatestWorkoutDate);
  const [date, setDate] = useState<IsoDate>(latestWorkoutDate);
  const dateData = useAppSelector((state: AppState) => getHistoryByDate(state, date));
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

  return (
    <ThemedView stretch>
      <SiteNavigationButtons titleFontSize={30} handleBack={handleNavigateBack} title={t("history")} />
      <PageContent style={styles.pageWrapper}>
        <ThemedView ghost stretch>
          {dateData.map((workout) => (
            <HStack key={workout.name} style={styles.displayedWorkoutWrapper}>
              <Text>{workout.name}</Text>
              <Text>{getDate(date)}</Text>
            </HStack>
          ))}
        </ThemedView>
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
          horizontal
          markedDates={markedDates}
        />
      </ThemedButtomSheetModal>
    </ThemedView>
  );
}
