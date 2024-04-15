import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { styles } from "../../../components/App/history/styles";
import { IsoDate } from "../../../types/date";
import { FlatList } from "react-native";
import { getEditedWorkout, getLatestWorkoutDate, getSortedDoneWorkout, getWorkoutsByMonth } from "../../../store/selectors/workout/workoutSelectors";
import { noop } from "lodash";
import { WorkoutHistoryCard } from "../../../components/WorkoutHistoryCard/WorkoutHistoryCard";
import { saveEditedWorkout } from "../../../store/reducers/workout";
import { WorkoutId } from "../../../store/reducers/workout/types";
import { ThemedDropdown } from "../../../components/Themed/Dropdown/ThemedDropdown";
import { getMonthYearLabel } from "../../../utils/date";
import { useTranslation } from "react-i18next";

export type FlatListData = {
    doneWorkoutId: WorkoutId;
    handleEdit?: () => void;
    name: string;
    date: IsoDate;
    marked: boolean;
};

export function WorkoutHistory() {
    const editedWorkout = useAppSelector(getEditedWorkout);
    const latestWorkoutDate = useAppSelector((state: AppState) => getLatestWorkoutDate(state, editedWorkout?.workout.workoutId));
    const [selectedDate, setSelectedDate] = useState<IsoDate | undefined>(undefined);
    const [selectedMonth, setSelectedMonth] = useState<string>("ALL_WORKOUTS");
    const doneWorkoutDates = useAppSelector((state: AppState) => getSortedDoneWorkout(state, editedWorkout?.workout?.workoutId));
    const workout = useAppSelector(getEditedWorkout);
    const sectionListRef = useRef<FlatList>(null);
    const { t } = useTranslation();
    const workoutsInMonth = useAppSelector((state: AppState) => getWorkoutsByMonth(state, selectedMonth));
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSelectedDate(latestWorkoutDate);
    }, [latestWorkoutDate]);

    const handleNavigateBack = useCallback(() => {
        dispatch(saveEditedWorkout());
        navigate("workouts");
    }, [dispatch, navigate]);

    const mappedDateData = useMemo(() => {
        return workoutsInMonth
            ?.map((section) => {
                const { doneWorkoutId, isoDate } = section;
                const handleEdit = () => {
                    setSelectedDate(isoDate);
                    navigate("workouts/history/workout/index", { doneWorkoutId });
                };
                const name = workout?.workout?.name ?? "";
                const marked = isoDate === selectedDate;
                return { handleEdit, date: isoDate, name, doneWorkoutId, marked };
            })
            .reverse();
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

    const monthConfig = useMemo(() => {
        if (!doneWorkoutDates) {
            return undefined;
        }
        const config = new Map<string, { dates: IsoDate[] }>();
        config.set("ALL_WORKOUTS", { dates: doneWorkoutDates });
        doneWorkoutDates?.forEach((date) => {
            const month = getMonthYearLabel(date);
            if (!config.get(month)) {
                config.set(month, { dates: [date] });
            } else {
                const monthConfig = config.get(month) as { dates: IsoDate[] };
                monthConfig?.dates.push(date);
                config.set(month, monthConfig);
            }
        });
        return config;
    }, [doneWorkoutDates]);

    const dropdownConfig = useMemo(
        () =>
            Array.from(monthConfig?.keys() ?? []).map((key) => {
                if (key === "ALL_WORKOUTS") {
                    return { label: t("history_all_workouts"), value: key };
                }
                return { label: key, value: key };
            }),
        [monthConfig, t],
    );

    const dropdownValue = useMemo(() => {
        return dropdownConfig.find((config) => config.value === selectedMonth)?.label;
    }, [dropdownConfig, selectedMonth]);

    const handleSelectMonth = useCallback((month: string) => {
        setSelectedMonth(month);
        setSelectedDate(undefined);
    }, []);

    const modalTitle = useMemo(() => t("history_modal_title"), [t]);

    return (
        <ThemedView stretch>
            <SiteNavigationButtons backButtonAction={handleNavigateBack} title={workout?.workout?.name} />
            <PageContent safeBottom background stretch>
                <ThemedDropdown modalTitle={modalTitle} onSelectItem={handleSelectMonth} value={dropdownValue} isSelectable options={dropdownConfig} />
                <FlatList
                    ref={sectionListRef}
                    horizontal={false}
                    data={mappedDateData}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    onScrollToIndexFailed={noop}
                    contentContainerStyle={styles.scrollViewContainer}
                    renderItem={renderItem}
                />
            </PageContent>
        </ThemedView>
    );
}
