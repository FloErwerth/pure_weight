import { HelpAnswer } from "../../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { AnswerText } from "../../../HelpQuestionAnswer/AnswerText";
import { InlinePressable } from "../../../InlinePressable/InlinePressable";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { NewLine } from "../NewLine";
import { Language } from "../../../../store/reducers/settings/types";
import { QuestionAnswerArray, SECTIONS } from "../types";

export const getTrainingsQuestions = (
    language: Language,
    setupNewWorkout: () => void,
    handleNavigateToWorkouts: () => void,
    handleSelectFromAnswer: (section: SECTIONS, index: number) => void,
    colorOfBackground: string,
    navigateToSettings: (index: number) => void,
): QuestionAnswerArray => {
    return [
        {
            title: language === "de" ? "Start eines Workouts" : "Starting a workout",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Nachdem Du ein <InlinePressable handlePress={setupNewWorkout}>Workout erstellt</InlinePressable> hast,
                                erscheint dies auf der
                                <InlinePressable handlePress={handleNavigateToWorkouts}>Workout übersicht</InlinePressable>. <NewLine />
                                Um das Workout nun zu starten, klicke auf das{" "}
                                <ThemedMaterialCommunityIcons ghost name="chevron-right" size={24} />
                                -Symbol innerhalb der Workout-Kachel. Du wirst dann zum ausgewählten Workout navigiert und kannst
                                trainieren.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                After you have <InlinePressable handlePress={setupNewWorkout}>created a workout</InlinePressable>, it will
                                appear on the <InlinePressable handlePress={handleNavigateToWorkouts}>workout overview</InlinePressable>.{" "}
                                <NewLine />
                                To start the workout, click on the <ThemedMaterialCommunityIcons
                                    ghost
                                    name="chevron-right"
                                    size={24}
                                />{" "}
                                symbol within the workout tile. You will then be navigated to the selected workout and can start training.
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
                                Nachdem Du ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>
                                    Workout gestartet
                                </InlinePressable>{" "}
                                hast erscheint die erste Übung des Workouts. <NewLine />
                                Der aktuelle Satz wird durch einen {colorOfBackground} Hintergrund hervorgehoben. <NewLine /> Um einen Satz
                                zu beenden, drücke auf das <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} />
                                -Symbol. Es erscheint auf der linken Seite des Satzes ein grünes{" "}
                                <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} color="green" /> und der nächste aktive Satz
                                wird automatisch ausgewählt.
                                <NewLine />
                                Falls der Eintrag des vorherigen Satzes nicht stimmt, kannst Du den Satz durch drücken des{" "}
                                <ThemedMaterialCommunityIcons ghost name="restart" size={24} />
                                -Symbols einfach ändern. <NewLine />
                                Ist es in den{" "}
                                <InlinePressable handlePress={() => navigateToSettings(1)}>Workout Einstellungen</InlinePressable> unter
                                &quot;Stoppuhr&quot; aktiviert, wird die Stoppuhr automatisch mit der eingestellten Pausenzeit der Übung
                                gestartet.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                After you have{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>
                                    started a workout
                                </InlinePressable>
                                , the first exercise of the workout appears. <NewLine />
                                The current set is highlighted with a {colorOfBackground} background. <NewLine /> To complete a set, press
                                the <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} />
                                symbol. A green <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} color="green" /> appears on
                                the left side of the set and the next active set is automatically selected.
                                <NewLine />
                                If the entry of the previous set is incorrect, you can easily change the set by pressing the{" "}
                                <ThemedMaterialCommunityIcons ghost name="restart" size={24} />
                                symbol. <NewLine />
                                If it is activated in the{" "}
                                <InlinePressable handlePress={() => navigateToSettings(1)}>workout settings</InlinePressable> under
                                &quot;Stopwatch&quot;, the stopwatch will automatically start with the set rest time.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Durchführung eines Workouts" : "Executing a workout",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Nachdem Du ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>
                                    Workout gestartet
                                </InlinePressable>
                                ,alle{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 1)}>
                                    alle Sätze einer Übung abgeschlossen
                                </InlinePressable>{" "}
                                und es in den{" "}
                                <InlinePressable handlePress={() => navigateToSettings(1)}>Workout Einstellungen</InlinePressable> unter
                                &quot;Zur nächsten Übung wechseln&quot; aktiviert hast, wird die aktive Übung automatisch gewechselt.
                                <NewLine />
                                Sind alle Sätze aller Übungen abgeschlossen, kann das Workout beendet werden, indem Du auf das{" "}
                                <ThemedMaterialCommunityIcons ghost name="check" size={24} />
                                -Symbol in der oberen rechten Ecke des Bildschrim drückst. <NewLine />
                                Wenn Du das{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 3)}>
                                    Workout abbrechen
                                </InlinePressable>{" "}
                                möchtest, kannst Du dies durch drücken des{" "}
                                <ThemedMaterialCommunityIcons ghost name="arrow-left" size={24} />
                                am oberen linken Rand deines Bildschirms machen. <NewLine />
                                Das durchgeführte Workout wird in die Historie aufgenommen und wird für die Anzeige des Fortschritts
                                verwendet.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                After you have{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>
                                    started a workout
                                </InlinePressable>{" "}
                                and completed all{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 1)}>
                                    all sets of an exercise
                                </InlinePressable>{" "}
                                and have activated it under &quot;Switch to next exercise&quot; in the{" "}
                                <InlinePressable handlePress={() => navigateToSettings(1)}>workout settings</InlinePressable>, the active
                                exercise will automatically be changed.
                                <NewLine />
                                If you have activated it in the{" "}
                                <InlinePressable handlePress={() => navigateToSettings(0)}>general settings</InlinePressable> under
                                &quot;Stopwatch&quot;, the stopwatch will automatically start after the end of the last set with the set
                                rest time.
                                <NewLine />
                                If all sets of all exercises are completed, the workout can be completed by pressing the{" "}
                                <ThemedMaterialCommunityIcons name="check" size={24} ghost /> symbol on the top right corner of the screen.{" "}
                                <NewLine />
                                If you want to{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 3)}>
                                    cancel an workout
                                </InlinePressable>
                                , you can do so by pressing the <ThemedMaterialCommunityIcons name="arrow-left" size={24} ghost /> at the
                                top left of your screen. <NewLine />
                                The performed workout is added to the history and is used to display the progress.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Workout abbrechen" : "Cancel an workout",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Nach dem Du ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>
                                    Workout gestartet
                                </InlinePressable>{" "}
                                hast kannst Du das Workout mit dem <ThemedMaterialCommunityIcons name="arrow-left" size={24} ghost /> am
                                oberen linken Rand deines Bildschirms abbrechen. <NewLine />
                                Hier gibt es drei Möglichkeiten das Workout zu beenden. <NewLine />
                                1. Speichern des Trainings mit dem Drücken auf den Button &quot;Workout speichern&quot;. Der Fortschritt
                                wird bis zu diesem Punkt gespeichert. <NewLine />
                                2. Beenden des Trainings mit dem Drücken auf den Button &quot;Workout pausieren&quot;. Der Fortschritt wird
                                nicht gespeichert, aber das Training kann zu einem späteren Zeitpunkt fortgesetzt werden.{" "}
                                <NewLine numberOfLines={1} />
                                Diese Option wird nur angezeigt, wenn das Workout noch nicht beendet wurde. <NewLine />
                                3. Abbruch des Trainings mit dem Drücken auf den Button &quot;Workout abbrechen&quot;. Der Fortschritt wird
                                nicht gespeichert und das Training wird beendet.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                After you have{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>
                                    started a workout
                                </InlinePressable>
                                , you can end the workout with the <ThemedMaterialCommunityIcons name="arrow-left" size={24} ghost /> at the
                                top left of your screen. <NewLine />
                                There are three ways to end the workout. <NewLine />
                                1. Save the training by pressing the button &quot;Save workout&quot;. The progress is saved up to this
                                point. <NewLine />
                                2. Pause the training by pressing the button &quot;Pause workout&quot;. The progress is not saved, but the
                                training can be continued at a later time. <NewLine numberOfLines={1} />
                                This option is only displayed, if your workout is not completed. <NewLine />
                                3. Cancel the training by pressing the button &quot;Cancel workout&quot;. The progress is not saved and the
                                training is completed.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Bearbeiten einer Übung während des Trainings" : "Editing an exercise during training",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Es ist möglich eine Übung während des Trainings zu bearbeiten. <NewLine />
                                Um eine Übung zu bearbeiten, drücke auf das <ThemedMaterialCommunityIcons ghost name="pencil" size={24} />
                                -Symbol neben dem Namen der aktuellen Übung. Dieser befindet sich unter der Seitennavigation. <NewLine />
                                Es öffnet sich ein Dialog, in dem die{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 0)}>
                                    Übung bearbeitet
                                </InlinePressable>{" "}
                                werden kann.
                                <NewLine />
                                Eine bearbeitete Übung wird sofort im aktuellen Workout angewendet.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                It is possible to edit an exercise during training. <NewLine />
                                To edit an exercise, press the <ThemedMaterialCommunityIcons ghost name="pencil" size={24} /> symbol next to
                                the name of the current exercise. This is located under the page navigation. <NewLine />A dialog opens in
                                which the{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 0)}>
                                    exercise can be edited
                                </InlinePressable>
                                .
                                <NewLine />
                                An edited exercise is immediately applied in the current workout.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Notizen" : "Notes",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Während eines Workouts ist es möglich zu jeder Übung Notizen zu machen. <NewLine />
                                Eine Notiz kann gemacht werden, indem auf das{" "}
                                <ThemedMaterialCommunityIcons ghost name="note-edit-outline" size={24} />
                                -Symbol neben dem Namen einer Übung geklickt wird. <NewLine />
                                Es öffnet sich ein Dialog, in dem die Notiz gemacht werden kann. Hast Du bereits eine Notiz gemacht, so wird
                                diese im Textfeld angezeigt. <NewLine />
                                Nachdem Du die Notiz fertig geschrieben hast, drücke auf &quot;Speichern&quot;. Dieser Button befindet sich
                                am Ende des Dialogs.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                During a workout it is possible to make notes for each exercise. <NewLine />A note can be made by clicking
                                on the <ThemedMaterialCommunityIcons ghost name="note-edit-outline" size={24} /> symbol next to the name of
                                an exercise. <NewLine />
                                A dialog opens in which the note can be made. If you have already made a note, it will be displayed in the
                                text field. <NewLine />
                                After you have finished writing the note, press &quot;Save&quot;. This button is located at the end of the
                                dialog.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Bereits absolvierte Übungen" : "Already completed exercises",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Hast Du die ausgewählte Übung in einem vorherigen Workout bereits einmal absolviert, dann werden die Daten
                                der letzten Durchführung unterhalb der aktuellen Übung angezeigt. <NewLine />
                                Hier kannst Du sehen an welchem Datum du die Übung das letzte Mal absolviert hast und auch welche{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 5)}>
                                    Notizen
                                </InlinePressable>{" "}
                                gemacht wurden. <NewLine />
                                Ähnlich wie bei dem{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 1)}>
                                    Durchführen eines Satzes
                                </InlinePressable>{" "}
                                wird in der Anzeige der vorherigen Übung der aktuelle Satz mit einem {colorOfBackground} Hintergrund
                                hervorgehoben. <NewLine />
                                Um die Notiz von der vorherigen Durchführung zu sehen, klicke auf &quot;Notiz anz.&quot;, welches sich neben
                                dem Datum der vorherigen Übung befindet.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                If you have already completed the selected exercise in a previous workout, the data of the last execution
                                will be displayed below the current exercise. <NewLine />
                                Here you can see on which date you last completed the exercise and also which{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 5)}>
                                    notes
                                </InlinePressable>{" "}
                                were made. <NewLine />
                                Similar to the{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 1)}>
                                    execution of a set
                                </InlinePressable>
                                , the current set is highlighted with a {colorOfBackground} background in the display of the previous
                                exercise. <NewLine />
                                To see the note from the previous execution, click on &quot;Show note&quot;, which is next to the date of
                                the previous exercise.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
    ];
};
