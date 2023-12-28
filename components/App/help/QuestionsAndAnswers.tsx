import { useAppDispatch, useAppSelector } from "../../../store";
import { useNavigate } from "../../../hooks/navigate";
import { useCallback, useMemo, useState } from "react";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedBottomSheetModal";
import { getLanguage, getSearchManual, getThemeKey } from "../../../store/reducers/settings/settingsSelectors";
import { createNewWorkout } from "../../../store/reducers/workout";
import { HelpQuestion } from "../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../Themed/ThemedView/View";
import { Text } from "../../Themed/ThemedText/Text";
import { ThemedScrollView } from "../../Themed/ThemedScrollView/ThemedScrollView";
import { View } from "react-native";
import { ProfileContent } from "../settings/components/ProfileContent/ProfileContent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMiscellaneousQuestions } from "./questions/miscellaneous";
import { getWorkoutsQuestions } from "./questions/workouts";
import { getExercisesQuestions } from "./questions/exercises";
import { getTrainingsQuestions } from "./questions/trainings";
import { QuestionAnswerArray, SECTIONS } from "./types";
import { getMeasurementQuestions } from "./questions/measurments";
import { setupNewMeasurement } from "../../../store/reducers/measurements";
import { useMeasurementOptionMap } from "../../../app/measurements/create";

export const QuestionsAndAnswers = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const theme = useAppSelector(getThemeKey);
    const searchedManual = useAppSelector(getSearchManual);
    const { bottom } = useSafeAreaInsets();

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    const [ref, open, , closeAll] = useBottomSheetRef();
    const [selectedQuesiton, setSelectedQuesiton] = useState<{ title: string; answer: JSX.Element; snapPoints?: SnapPoint[] } | undefined>();
    const language = useAppSelector(getLanguage);
    const measurementOptionMap = useMeasurementOptionMap();
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

    const navigateToMesurements = useCallback(() => {
        navigate("measurements");
    }, [navigate]);

    const sectionTitleMap = useMemo(
        () => ({
            [SECTIONS.WORKOUTS]: "Workouts",
            [SECTIONS.EXERCISES]: language === "de" ? "Übungen" : "Exercises",
            [SECTIONS.TRAININGS]: language === "de" ? "Während des Trainings" : "During the training",
            [SECTIONS.MEASUREMENTS]: language === "de" ? "Messungen" : "Measurements",
            [SECTIONS.MISCELLANEOUS]: language === "de" ? "Sonstiges" : "Miscellaneous",
        }),
        [language],
    );

    const createNewMeasurement = useCallback(() => {
        closeAll();
        navigate("measurement/create");
        dispatch(setupNewMeasurement());
    }, [closeAll, dispatch, navigate]);

    const colorOfBackground = useMemo(() => {
        if (theme === "dark") {
            return language === "de" ? "dunklen" : "dark";
        }
        return language === "de" ? "hellen" : "light";
    }, [language, theme]);

    const data = useMemo((): Record<SECTIONS, QuestionAnswerArray> => {
        const handleSelectFromAnswer = (section: SECTIONS, index: number) => {
            const selectedData = data[section][index];
            setSelectedQuesiton({ title: selectedData.title, answer: selectedData.answer, snapPoints: selectedData.snapPoints });
            open();
        };

        return {
            [SECTIONS.WORKOUTS]: getWorkoutsQuestions(language, handleNavigateToWorkouts, handleSelectFromAnswer, setupNewWorkout),
            [SECTIONS.EXERCISES]: getExercisesQuestions(language, handleSelectFromAnswer),
            [SECTIONS.TRAININGS]: getTrainingsQuestions(language, setupNewWorkout, handleNavigateToWorkouts, handleSelectFromAnswer, colorOfBackground, navigateToSettings),
            [SECTIONS.MEASUREMENTS]: getMeasurementQuestions(language, navigateToMesurements, handleSelectFromAnswer, createNewMeasurement, measurementOptionMap),
            [SECTIONS.MISCELLANEOUS]: getMiscellaneousQuestions(navigateToSettings, language),
        };
    }, [colorOfBackground, createNewMeasurement, handleNavigateToWorkouts, language, navigateToMesurements, navigateToSettings, open, setupNewWorkout]);

    const handleSetSelectedQuestion = useCallback(
        (section: SECTIONS, index: number) => {
            const selectedData = data[section][index];
            setSelectedQuesiton({ title: selectedData.title, answer: selectedData.answer, snapPoints: selectedData.snapPoints });
            open();
        },
        [data, open],
    );

    const mappedAndFilteredData = useMemo(() => {
        return Object.entries(data).map(([section, data]) => ({
            sectionTitle: sectionTitleMap[section as unknown as SECTIONS],
            handleSelectQuestion: (index: number) => handleSetSelectedQuestion(section as unknown as SECTIONS, index),
            data: data
                .map(({ title, answer, snapPoints }) => ({ title, answer, snapPoints }))
                .filter(({ title }) => {
                    if (!searchedManual) {
                        return true;
                    }
                    return title.toLowerCase().includes(searchedManual.toLowerCase());
                }),
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
                contentContainerStyle={{ gap: 20 }}
            >
                {mappedAndFilteredData.map(({ sectionTitle, handleSelectQuestion, data }) => {
                    if (data.length === 0) {
                        return null;
                    }
                    return (
                        <View key={sectionTitle}>
                            <Text ghost style={{ marginBottom: 10, fontSize: 30 }}>
                                {sectionTitle}
                            </Text>
                            <ProfileContent>
                                {data.map(({ title }, index) => (
                                    <HelpQuestion key={index} question={title} title={title} onPress={() => handleSelectQuestion(index)} />
                                ))}
                            </ProfileContent>
                        </View>
                    );
                })}
            </ThemedScrollView>
            <ThemedBottomSheetModal ref={ref} title={selectedQuesiton?.title} snapPoints={selectedQuesiton?.snapPoints}>
                {selectedQuesiton?.answer}
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
