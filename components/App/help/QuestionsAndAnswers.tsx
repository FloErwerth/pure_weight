import { useAppDispatch, useAppSelector } from "../../../store";
import { useNavigate } from "../../../hooks/navigate";
import { useCallback, useMemo, useState } from "react";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedBottomSheetModal";
import { getLanguage, getSearchManual, getThemeKeyFromStore } from "../../../store/selectors/settings/settingsSelectors";
import { createNewWorkout } from "../../../store/reducers/workout";
import { HelpQuestion } from "../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../Themed/ThemedView/View";
import { Text } from "../../Themed/ThemedText/Text";
import { ThemedScrollView } from "../../Themed/ThemedScrollView/ThemedScrollView";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMiscellaneousQuestions } from "./questions/miscellaneous";
import { getWorkoutsQuestions } from "./questions/workouts";
import { getExercisesQuestions } from "./questions/exercises";
import { getTrainingsQuestions } from "./questions/trainings";
import { QuestionAnswerArray, SECTIONS } from "./types";
import { getMeasurementQuestions } from "./questions/measurements";
import { setupNewMeasurement } from "../../../store/reducers/measurements";
import { useMeasurementOptionMap } from "../../../app/measurements/create";
import { getProQuestions } from "./questions/pro";

export const QuestionsAndAnswers = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const theme = useAppSelector(getThemeKeyFromStore);
    const searchedManual = useAppSelector(getSearchManual);
    const { bottom } = useSafeAreaInsets();
    const measurementOptionMap = useMeasurementOptionMap();

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    const { ref, openBottomSheet: open, closeAll } = useBottomSheetRef();
    const [selectedQuesiton, setSelectedQuesiton] = useState<{ title: string; answer: JSX.Element } | undefined>();
    const language = useAppSelector(getLanguage);
    const setupNewWorkout = useCallback(() => {
        closeAll();
        navigate("create");
        dispatch(createNewWorkout());
    }, [closeAll, dispatch, navigate]);

    const navigateToSettings = useCallback(
        (scrollIndex?: number) => {
            navigate("settings", { scrollIndex });
        },
        [navigate],
    );

    const sectionTitleMap = useMemo(
        () => ({
            [SECTIONS.PRO]: "PRO",
            [SECTIONS.WORKOUTS]: "Workouts",
            [SECTIONS.EXERCISES]: language === "de" ? "Übungen" : "Exercises",
            [SECTIONS.TRAININGS]: language === "de" ? "Während des Trainings" : "During the training",
            [SECTIONS.MEASUREMENTS]: language === "de" ? "Messungen" : "Measurements",
            [SECTIONS.MISCELLANEOUS]: language === "de" ? "Sonstiges" : "Miscellaneous",
        }),
        [language],
    );

    const colorOfBackground = useMemo(() => {
        if (theme === "dark") {
            return language === "de" ? "dunklen" : "dark";
        }
        return language === "de" ? "hellen" : "light";
    }, [language, theme]);

    const navigateToMesurements = useCallback(() => {
        navigate("measurements");
    }, [navigate]);

    const createNewMeasurement = useCallback(() => {
        closeAll();
        navigate("measurement/create");
        dispatch(setupNewMeasurement());
    }, [closeAll, dispatch, navigate]);

    const handleNavigateToPurchse = useCallback(() => {
        closeAll();
        navigate("purchase");
    }, [closeAll, navigate]);

    const data = useMemo((): Record<SECTIONS, QuestionAnswerArray> => {
        const handleSelectFromAnswer = (section: SECTIONS, index: number) => {
            const selectedData = data[section][index];
            setSelectedQuesiton({ title: selectedData.title, answer: selectedData.answer });
            open();
        };

        return {
            [SECTIONS.PRO]: getProQuestions(language, handleNavigateToPurchse),
            [SECTIONS.WORKOUTS]: getWorkoutsQuestions(language, handleNavigateToWorkouts, handleSelectFromAnswer, setupNewWorkout),
            [SECTIONS.EXERCISES]: getExercisesQuestions(language, handleSelectFromAnswer),
            [SECTIONS.TRAININGS]: getTrainingsQuestions(language, setupNewWorkout, handleNavigateToWorkouts, handleSelectFromAnswer, colorOfBackground, navigateToSettings),
            [SECTIONS.MEASUREMENTS]: getMeasurementQuestions(language, navigateToMesurements, handleSelectFromAnswer, createNewMeasurement, measurementOptionMap),
            [SECTIONS.MISCELLANEOUS]: getMiscellaneousQuestions(navigateToSettings, language),
        };
    }, [colorOfBackground, createNewMeasurement, handleNavigateToPurchse, handleNavigateToWorkouts, language, measurementOptionMap, navigateToMesurements, navigateToSettings, open, setupNewWorkout]);

    const handleSetSelectedQuestion = useCallback(
        (section: SECTIONS, index: number) => {
            const selectedData = data[section][index];
            setSelectedQuesiton({ title: selectedData.title, answer: selectedData.answer });
            open();
        },
        [data, open],
    );

    const mappedAndFilteredData = useMemo(() => {
        return Object.entries(data).map(([section, data]) => ({
            sectionTitle: sectionTitleMap[section as unknown as SECTIONS],
            handleSelectQuestion: (index: number) => handleSetSelectedQuestion(section as unknown as SECTIONS, index),
            data: data.map(({ title, answer }) => ({
                title,
                answer,
                shown: !searchedManual || title.toLowerCase().includes(searchedManual.toLowerCase()),
            })),
        }));
    }, [data, handleSetSelectedQuestion, searchedManual, sectionTitleMap]);

    return (
        <ThemedView ghost stretch>
            <ThemedScrollView
                alwaysBounceVertical={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentInset={{ bottom }}
                ghost
                contentContainerStyle={{ gap: 20 }}>
                {mappedAndFilteredData.map(({ sectionTitle, handleSelectQuestion, data }) => {
                    if (data.every(({ shown }) => !shown)) {
                        return null;
                    }
                    return (
                        <View key={sectionTitle}>
                            <Text ghost style={{ marginBottom: 10, fontSize: 30 }}>
                                {sectionTitle}
                            </Text>
                            {data.map(({ title, shown }, index) => (
                                <HelpQuestion key={title.concat(index.toString())} shown={shown} question={title} title={title} onPress={() => handleSelectQuestion(index)} />
                            ))}
                        </View>
                    );
                })}
            </ThemedScrollView>
            <ThemedBottomSheetModal ref={ref} title={selectedQuesiton?.title}>
                {selectedQuesiton?.answer}
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
