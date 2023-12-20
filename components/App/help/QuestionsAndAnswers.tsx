import { useAppDispatch, useAppSelector } from "../../../store";
import { useNavigate } from "../../../hooks/navigate";
import { useCallback, useMemo, useState } from "react";
import { SnapPoint, ThemedBottomSheetModal, useBottomSheetRef } from "../../BottomSheetModal/ThemedBottomSheetModal";
import { getLanguage, getThemeKey } from "../../../store/reducers/settings/settingsSelectors";
import { createNewWorkout } from "../../../store/reducers/workout";
import { HelpAnswer, HelpQuestion } from "../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../Themed/ThemedView/View";
import { AnswerText } from "../../HelpQuestionAnswer/AnswerText";
import { InlinePressable } from "../../InlinePressable/InlinePressable";
import { ThemedMaterialCommunityIcons } from "../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedPressable } from "../../Themed/Pressable/Pressable";
import { Text } from "../../Themed/ThemedText/Text";
import { ThemedScrollView } from "../../Themed/ThemedScrollView/ThemedScrollView";
import { View } from "react-native";
import { ProfileContent } from "../settings/components/ProfileContent/ProfileContent";
import { NewLine } from "./NewLine";

enum SECTIONS {
    WORKOUTS = "WORKOUTS",
    EXERCISES = "EXERCISES",
    MISCELLANEOUS = "MISCELLANEOUS",
    TRAININGS = "TRAININGS",
}

export const QuestionsAndAnswers = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const theme = useAppSelector(getThemeKey);

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);
    const [ref, open, , closeAll] = useBottomSheetRef();
    const [selectedQuesiton, setSelectedQuesiton] = useState<{ title: string; answer: JSX.Element; snapPoints?: SnapPoint[] } | undefined>();
    const language = useAppSelector(getLanguage);

    const setupNewWorkout = useCallback(() => {
        closeAll();
        navigate("create");
        dispatch(createNewWorkout());
    }, [closeAll, dispatch, navigate]);

    const navigateToSettings = useCallback(() => {
        navigate("settings");
    }, [navigate]);

    const sectionTitleMap = useMemo(
        () => ({
            [SECTIONS.WORKOUTS]: language === "de" ? "Gespeicherte Workouts" : "Saved Workouts",
            [SECTIONS.TRAININGS]: language === "de" ? "Während des Trainings" : "During the training",
            [SECTIONS.EXERCISES]: language === "de" ? "Übungen" : "Exercises",
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

    const data = useMemo((): Record<SECTIONS, Array<{ title: string; answer: JSX.Element; snapPoints?: SnapPoint[] }>> => {
        const handleSelectFromAnswer = (section: SECTIONS, index: number) => {
            const selectedData = data[section][index];
            setSelectedQuesiton({ title: selectedData.title, answer: selectedData.answer, snapPoints: selectedData.snapPoints });
            open();
        };

        return {
            [SECTIONS.WORKOUTS]: [
                {
                    title: language === "de" ? "Erstellung eines Workouts" : "Creation of a workout",
                    answer: (
                        <HelpAnswer>
                            <ThemedView ghost stretch style={{ gap: 20 }}>
                                <AnswerText>
                                    <InlinePressable handlePress={handleNavigateToWorkouts}>Navigiere zu Workouts</InlinePressable>, klicke auf das{" "}
                                    <ThemedMaterialCommunityIcons name="plus" size={24} ghost />
                                    -Symbol und erstelle die Übungen, die du in dein Workout einbauen möchtest. {"\n\n"}
                                    Wenn Du fertig bist, klicke auf das <ThemedMaterialCommunityIcons name="check" size={24} ghost />
                                    -Symbol oben rechts im Workout-Erstellen Bildschirm.
                                </AnswerText>
                                <ThemedPressable onPress={setupNewWorkout} center padding round>
                                    <Text style={{ fontSize: 16 }}>Klicke hier, um sofort ein neues Workout zu erstellen</Text>
                                </ThemedPressable>
                            </ThemedView>
                        </HelpAnswer>
                    ),
                },
                {
                    title: language === "de" ? "Bearbeitung eines Workouts" : "Editing of a workout",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Um ein Workout zu bearbeiten, benötigst Du zuerst ein vorhandenes{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>Workout</InlinePressable>.<NewLine /> Navigiere zu den{" "}
                                        <InlinePressable handlePress={handleNavigateToWorkouts}>Workouts</InlinePressable> und wische dann das gewünschte Workout nach rechts. <NewLine />
                                        Nun wirst Du zur Workout Bearbeitung navigiert und kannst das Workout gewüns
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        To edit a workout, you first need an existing <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>workout</InlinePressable>.
                                        <NewLine />
                                        Navigate to the <InlinePressable handlePress={handleNavigateToWorkouts}>workouts</InlinePressable> and then swipe the desired workout to the right. <NewLine />
                                        You will now be navigated to the workout editing and can edit the workout as desired.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                },
                {
                    title: language === "de" ? "Löschung eines Workouts" : "Deletion of a workout",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Um ein Workout zu löschen, navigiere zu den <InlinePressable handlePress={handleNavigateToWorkouts}>Workouts</InlinePressable> und wische dann das gewünschte
                                        Workout nach links. {"\n\n"}
                                        Dieses Workout wird nun gelöscht. Ein gelöschtes Workout kann nicht wiederhergestellt werden, nachdem{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 4)}>das Zeitfenster</InlinePressable> für das Rückgängig machen abgelaufen ist.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        To delete a workout, navigate to the <InlinePressable handlePress={handleNavigateToWorkouts}>Workouts</InlinePressable> and then swipe the desired workout to
                                        the left. {"\n\n"}
                                        This workout will now be deleted. A deleted workout cannot be restored after{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 4)}>the time window</InlinePressable> for undoing has expired.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                },
            ],
            [SECTIONS.TRAININGS]: [
                {
                    title: language === "de" ? "Start eines Workouts" : "Start of a workout",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Nachdem Du ein <InlinePressable handlePress={setupNewWorkout}>Workout erstellt</InlinePressable> hast, erscheint dies auf der
                                        <InlinePressable handlePress={handleNavigateToWorkouts}>Workout übersicht</InlinePressable>. {"\n\n"}
                                        Um das Workout nun zu starten, klicke auf das <ThemedMaterialCommunityIcons ghost name="chevron-right" size={24} />
                                        -Symbol innerhalb der Workout-Kachel. Du wirst dann zum ausgewählten Workout navigiert und kannst trainieren.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        After you have <InlinePressable handlePress={setupNewWorkout}>created a workout</InlinePressable>, it will appear on the{" "}
                                        <InlinePressable handlePress={handleNavigateToWorkouts}>workout overview</InlinePressable>. {"\n\n"}
                                        To start the workout, click on the <ThemedMaterialCommunityIcons ghost name="chevron-right" size={24} /> symbol within the workout tile. You will then be
                                        navigated to the selected workout and can start training.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                },

                {
                    title: language === "de" ? "Durchführung eines Satzes" : "Executing a set",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Nachdem Du ein <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>Workout gestartet</InlinePressable> hast erscheint die erste
                                        Übung des Workouts. <NewLine />
                                        Der aktuelle Satz wird durch einen {colorOfBackground} Hintergrund hervorgehoben. <NewLine /> Um einen Satz zu beenden, drücke auf das{" "}
                                        <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} />
                                        -Symbol. <NewLine /> Wird ein Satz als beendet markiert, wird der nächste aktive Satz automatisch ausgewählt und das{" "}
                                        <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} /> des vorherigen Satzes wird grün. <NewLine />
                                        Falls der Eintrag des vorherigen Satzes nicht stimmt, kannst Du die Daten einfach ändern. <NewLine />
                                        Ist es in den <InlinePressable handlePress={navigateToSettings}>Workout Einstellungen</InlinePressable> unter &quot;Stoppuhr&quot; aktiviert, wird die Stoppuhr
                                        automatisch mit der eingestellten Pausenzeit der Übung gestartet.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        After you have <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>started a workout</InlinePressable>, the first exercise of the
                                        workout appears.
                                        <NewLine />
                                        The current set is highlighted by a {colorOfBackground} background. <NewLine /> To finish a set, press the{" "}
                                        <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} /> symbol. <NewLine /> If a set is marked as finished, the next active set is automatically
                                        selected and the <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} /> of the previous set turns green. <NewLine />
                                        If the entry of the previous set is not correct, you can simply change the data. <NewLine />
                                        If it is activated in the <InlinePressable handlePress={navigateToSettings}>workout settings</InlinePressable> under &quot;Stopwatch&quot;, the stopwatch will
                                        automatically start with the set rest time.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                    snapPoints: ["85%"],
                },
                {
                    title: language === "de" ? "Durchführung eines Workouts" : "Executing a workout",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Nachdem Du ein <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>Workout gestartet</InlinePressable> und alle{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 1)}>alle Sätze einer Übung abgeschlossen</InlinePressable> und es in den{" "}
                                        <InlinePressable handlePress={navigateToSettings}>Workout Einstellungen</InlinePressable> unter &quot;Zur nächsten Übung wechseln&quot; aktiviert hast, wird die
                                        aktive Übung automatisch gewechselt.
                                        <NewLine />
                                        Sofern Du es in den <InlinePressable handlePress={navigateToSettings}>Allgemeinen Einstellungen</InlinePressable> unter &quot;Stoppuhr&quot; aktiviert hast,
                                        wird die Stoppuhr nach dem Ende des letzten Satzes automatisch mit der eingestellten Pausenzeit der Übung gestartet. <NewLine />
                                        Sind alle Sätze aller Übungen abgeschlossen, kann das{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 3)}>Workout beendet</InlinePressable> werden. <NewLine />
                                        Das durchgeführte Workout wird in die Historie aufgenommen und wird für die Anzeige des Fortschritts verwendet.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        After you have <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>started a workout</InlinePressable> and completed all{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 1)}>all sets of an exercise</InlinePressable> and have activated it under
                                        &quot;Switch to next exercise&quot; in the <InlinePressable handlePress={navigateToSettings}>workout settings</InlinePressable>, the active exercise will
                                        automatically be changed.
                                        <NewLine />
                                        If you have activated it in the <InlinePressable handlePress={navigateToSettings}>general settings</InlinePressable> under &quot;Stopwatch&quot;, the stopwatch
                                        will automatically start after the end of the last set with the set rest time.
                                        <NewLine />
                                        If all sets of all exercises are completed, the{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 3)}>workout can be ended</InlinePressable>.
                                        <NewLine />
                                        The performed workout is added to the history and is used to display the progress.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                    snapPoints: ["85%"],
                },
                {
                    title: language === "de" ? "Beenden eines Workouts" : "End of a workout",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Nach dem Du ein <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>Workout gestartet</InlinePressable> hast, gibt es zwei
                                        Möglichkeiten, um das Training zu beenden.
                                        <NewLine />
                                        Die erste Möglichkeit ist der Abbruch des Trainings mit dem Drücken auf das <ThemedMaterialCommunityIcons name="arrow-left" size={24} ghost />
                                        -Symbol am oberen linken Rand deines Bildschirms. Der Fortschritt wird bis zu diesem Punkt gespeichert.
                                        <NewLine />
                                        Die zweite Möglchkeit ist das Beenden des Trainings mit dem Drücken auf das <ThemedMaterialCommunityIcons name="check" size={24} ghost />
                                        -Symbol am oberen rechten Rand deines Bildschirms. Dies erscheint jedoch erst, wenn das Workout komplett beendet wurde.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        After you have <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>started a workout</InlinePressable>, there are two ways to end
                                        the training.
                                        <NewLine />
                                        The first possibility is to abort the training by pressing the <ThemedMaterialCommunityIcons name="arrow-left" size={24} ghost /> symbol at the top left of your
                                        screen. The progress will be saved up to this point.
                                        <NewLine />
                                        The second possibility is to end the training by pressing the <ThemedMaterialCommunityIcons name="check" size={24} ghost /> symbol at the top right of your
                                        screen. However, this only appears when the workout has been completed.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                    snapPoints: ["60%"],
                },
            ],
            [SECTIONS.EXERCISES]: [
                {
                    title: language === "de" ? "Erstellung einer Übung" : "Creation of an exercise",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Um eine Übung zu bearbeiten, musst Du zuerst ein{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>Workout bearbeiten</InlinePressable>. <NewLine />
                                        Anschließend kannst Du eine Übung hinzufügen, indem Du auf &quot;Übung hinzufügen&quot; am unteren Ende deines Bildschirms drückst. <NewLine />
                                        Es öffnet sich der Dialog zum Erstellen einer Übung. Trage nun die Daten für deine neue Übung ein. <NewLine />
                                        Wenn Du damit fertig bist, drücke auf &quot;Übung erstellen&quot;. Nun wird die neue Übung im Workout angezeigt.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        To edit an exercise, you have to edit an <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>existing workout</InlinePressable>{" "}
                                        first. <NewLine />
                                        In the opened workout you can then add an exercise by pressing &quot;Add exercise&quot; at the bottom of your screen. <NewLine />
                                        The dialog for creating an exercise will open. Now enter the data for your new exercise. <NewLine />
                                        When you are done, click on &quot;Create exercise&quot;. The new exercise will now be displayed in the workout.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                    snapPoints: ["75%"],
                },
                {
                    title: language === "de" ? "Bearbeitung einer Übung" : "Editing of an exercise",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Um eine Übung zu bearbeiten, musst Du zuerst ein{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>Workout bearbeiten</InlinePressable>. <NewLine />
                                        Im geöffneten Workout kannst Du nun auf den Namen der vorhandenen Übung klicken, um die Übung zu bearbeiten. <NewLine />
                                        Es öffnet sich der Dialog zum Bearbeiten einer Übung. Ändere nun die Daten deiner Übung. <NewLine />
                                        Wenn Du damit fertig bist, klicke auf &quot;Bestätigen&quot; am unteren Ende des Dialogs. Der Dialog schließt sich und die bearbeitete Übung wird im Workout
                                        hinterlegt.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        To edit an exercise, you have to edit an <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>existing workout</InlinePressable>{" "}
                                        first. <NewLine />
                                        In the opened workout you can now click on the name of the existing exercise to edit the exercise. <NewLine />
                                        The dialog for editing an exercise will open. Now change the data of your exercise. <NewLine />
                                        When you are done, click on &quot;Confirm&quot; at the bottom of the dialog. The dialog will close and the edited exercise will be stored in the workout.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                    snapPoints: ["75%"],
                },
                {
                    title: language === "de" ? "Löschung einer Übung" : "Deletion of an exercise",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Um eine Übung zu bearbeiten, musst Du zuerst ein{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>Workout bearbeiten</InlinePressable>. <NewLine />
                                        Eine Übung kann nun gelöscht werden, indem auf das <ThemedMaterialCommunityIcons ghost name="trash-can-outline" size={24} />
                                        -Symbol neben dem Namen der Übung geklickt wurde. <NewLine />
                                        Es erscheint ein Dialog, ob Du dir sicher bist, dass Du die Übung löschen möchtest. Bestätige nun die Löschung der Übung. <NewLine />
                                        Die Übung wird nun aus dem Workout gelöscht. Eine gelöschte Übung kann nicht wiederhergestellt werden, nachdem{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 4)}>das Zeitfenster</InlinePressable> für das Rückgängig machen abgelaufen ist.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        To delete an exercise, you first have to create a{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>new workout</InlinePressable> or edit an{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>existing workout</InlinePressable>. <NewLine />
                                        An exercise can now be deleted by clicking on the <ThemedMaterialCommunityIcons ghost name="trash-can-outline" size={24} /> symbol next to the name of the
                                        exercise. <NewLine />
                                        A dialog appears asking if you are sure you want to delete the exercise. Now confirm the deletion of the exercise. <NewLine />
                                        The exercise will now be deleted from the workout. A deleted exercise cannot be restored after{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 4)}>the time window</InlinePressable> for undoing has expired.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                    snapPoints: ["75%"],
                },
                {
                    title: language === "de" ? "Reihenfolge der Übungen" : "Order of the exercises",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Um die Reihenfolge der Übungen ändern zu können musst Du zuerst ein{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>Workout bearbeiten</InlinePressable>. <NewLine />
                                        Außerdem müssen mindestens zwei Übungen im Workout vorhanden sein. <NewLine />
                                        Die Reihenfolge der Übungen kann nun geändert werden, indem Du etwas länger auf das <ThemedMaterialCommunityIcons name="drag" size={24} ghost />
                                        -Symbol neben dem <ThemedMaterialCommunityIcons name="trash-can-outline" size={24} ghost />
                                        -Symbol einer Übung drückst und diese dann an die gewünschte Position ziehst. <NewLine />
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        To be able to change the order of the exercises you first have to edit a{" "}
                                        <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>workout</InlinePressable>. <NewLine />
                                        At least two exercises must also be present in the workout. <NewLine />
                                        The order of the exercises can now be changed by pressing a little longer on the <ThemedMaterialCommunityIcons name="drag" size={24} ghost /> symbol next to the{" "}
                                        <ThemedMaterialCommunityIcons name="trash-can-outline" size={24} ghost /> symbol of an exercise and then dragging it to the desired position. <NewLine />
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                },
            ],
            [SECTIONS.MISCELLANEOUS]: [
                {
                    title: language === "de" ? "Löschung Rückgängig machen" : "Undo deletion",
                    answer:
                        language === "de" ? (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        Nachdem Du etwas gelöscht hast, erscheint am unteren Bildschirmrand ein Hinweis, dass etwas gelöscht wurde. Klicke auf den Hinweis, um die Löschung rückgängig
                                        zu machen. Dieser Hinweis wird nach einiger Zeit automatisch verschwinden.
                                        <NewLine /> Nach dem Ablauf dieser Zeit kann die Löschung nicht rückgängig gemacht werden. Die Zeit für die Rückgängig-Machung kann in den{" "}
                                        <InlinePressable handlePress={navigateToSettings}>Einstellungen</InlinePressable> unter &quot;Löschzeit&quot; geändert werden.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ) : (
                            <HelpAnswer>
                                <ThemedView ghost stretch style={{ gap: 20 }}>
                                    <AnswerText>
                                        After you have deleted something, a message will appear at the bottom of the screen that something has been deleted.
                                        <NewLine /> Click on the message to undo the deletion. This message will automatically disappear after a certain time.
                                        <NewLine /> After this time has expired, the deletion cannot be undone. The time for undoing can be changed in the{" "}
                                        <InlinePressable handlePress={navigateToSettings}>settings</InlinePressable> under &quot;Deletion time&quot;.
                                    </AnswerText>
                                </ThemedView>
                            </HelpAnswer>
                        ),
                    snapPoints: ["60%"],
                },
            ],
        };
    }, [handleNavigateToWorkouts, language, navigateToSettings, open, setupNewWorkout]);

    const handleSetSelectedQuestion = useCallback(
        (section: SECTIONS, index: number) => {
            const selectedData = data[section][index];
            setSelectedQuesiton({ title: selectedData.title, answer: selectedData.answer, snapPoints: selectedData.snapPoints });
            open();
        },
        [data, open],
    );

    return (
        <ThemedScrollView ghost contentContainerStyle={{ gap: 20 }}>
            {Object.entries(data).map(([section, data]) => {
                return (
                    <View key="QUESTIONS_CONTAINER_WRAPPER">
                        <Text ghost style={{ marginBottom: 10, fontSize: 30 }}>
                            {sectionTitleMap[section as unknown as SECTIONS]}
                        </Text>
                        <ProfileContent>
                            {data.map(({ title }, index) => (
                                <HelpQuestion key={index} question={title} title={title} onPress={() => handleSetSelectedQuestion(section as unknown as SECTIONS, index)} />
                            ))}
                        </ProfileContent>
                    </View>
                );
            })}
            <ThemedBottomSheetModal ref={ref} title={selectedQuesiton?.title} snapPoints={selectedQuesiton?.snapPoints}>
                {selectedQuesiton?.answer}
            </ThemedBottomSheetModal>
        </ThemedScrollView>
    );
};
