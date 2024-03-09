import { noop } from "lodash";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { IsoDate } from "../../types/date";
import { Dimensions, FlatList } from "react-native";
import { RenderedDay } from "../App/history/RenderedDay/RenderedDay";
import { FlatListData } from "../../app/workouts/history";
import { useTheme } from "../../theme/context";
import { useAppSelector } from "../../store";
import { getLanguage } from "../../store/selectors/settings/settingsSelectors";

export type DateConfig = Partial<{ date: IsoDate; marked: boolean; selectable: boolean; latest: boolean }>;
interface DatePickerProps {
    selectedDate: IsoDate;
    handleSelectDate: (date: IsoDate) => void;
    dateConfig?: DateConfig[];
    allSelectable?: boolean;
}
LocaleConfig.locales["de"] = {
    monthNames: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ],
    monthNamesShort: ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."],
    dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    dayNamesShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
    today: "Heute",
};
LocaleConfig.locales["en"] = {
    monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
    monthNamesShort: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
    today: "Today",
};

export const DatePicker = ({ selectedDate, handleSelectDate, dateConfig, allSelectable = false }: DatePickerProps) => {
    const sectionListRef = useRef<FlatList>(null);
    const { mainColor, textDisabled } = useTheme();
    const latestDate = dateConfig?.find((config) => config.latest)?.date;
    const language = useAppSelector(getLanguage);

    useEffect(() => {
        LocaleConfig.defaultLocale = language;
    }, [language]);

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

    const dayComponent = useCallback(
        ({ date }: DayProps & { date?: DateData | undefined }) => {
            const config = dateConfig?.find((config) => config.date === date?.dateString);

            if (!date?.dateString || !date?.day) {
                return null;
            }

            const day = config?.date;
            const isoDate = day as IsoDate;

            const scrollCallback = () => {
                if ((sectionListRef.current?.props.data as Array<FlatListData>)?.findIndex) {
                    const possibleIndexToScrollTo = (
                        sectionListRef.current?.props.data as Array<FlatListData>
                    ).findIndex((data: FlatListData) => data.date === isoDate);
                    const indexToScrollTo =
                        possibleIndexToScrollTo !== undefined && possibleIndexToScrollTo !== -1
                            ? possibleIndexToScrollTo
                            : 0;
                    sectionListRef.current?.scrollToIndex({
                        index: indexToScrollTo,
                        viewOffset: Dimensions.get("window").height * 0.28,
                        animated: true,
                    });
                }
            };

            const handleDayPress = () => {
                handleSelectDate(date.dateString as IsoDate);
                setTimeout(scrollCallback, 200);
            };

            return (
                <RenderedDay
                    latestDay={config?.latest}
                    selected={selectedDate === date.dateString}
                    handleSelectDate={handleDayPress}
                    day={date?.day.toString()}
                    marked={config?.marked ?? false}
                    selectable={allSelectable || config?.selectable}
                />
            );
        },
        [allSelectable, dateConfig, handleSelectDate, selectedDate],
    );

    return (
        <Calendar
            onScrollToIndexFailed={noop}
            current={selectedDate ?? latestDate}
            dayComponent={dayComponent}
            showScrollIndicator={false}
            theme={calendarTheme}
            horizontal
        />
    );
};
