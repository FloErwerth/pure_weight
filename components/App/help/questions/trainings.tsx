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
            title: language === "de" ? "Start eines Workouts" : "Start of a workout",
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
                                -Symbol. <NewLine /> Wird ein Satz als beendet markiert, wird der nächste aktive Satz automatisch ausgewählt
                                und das <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} /> des vorherigen Satzes wird grün.{" "}
                                <NewLine />
                                Falls der Eintrag des vorherigen Satzes nicht stimmt, kannst Du die Daten einfach ändern. <NewLine />
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
                                , the first exercise of the workout appears.
                                <NewLine />
                                The current set is highlighted by a {colorOfBackground} background. <NewLine /> To finish a set, press the{" "}
                                <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} /> symbol. <NewLine /> If a set is marked as
                                finished, the next active set is automatically selected and the{" "}
                                <ThemedMaterialCommunityIcons ghost name="check-bold" size={24} /> of the previous set turns green.{" "}
                                <NewLine />
                                If the entry of the previous set is not correct, you can simply change the data. <NewLine />
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
                                Sofern Du es in den{" "}
                                <InlinePressable handlePress={() => navigateToSettings(0)}>Allgemeinen Einstellungen</InlinePressable> unter
                                &quot;Stoppuhr&quot; aktiviert hast, wird die Stoppuhr nach dem Ende des letzten Satzes automatisch mit der
                                eingestellten Pausenzeit der Übung gestartet. <NewLine />
                                Sind alle Sätze aller Übungen abgeschlossen, kann das{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 3)}>
                                    Workout beendet
                                </InlinePressable>{" "}
                                werden. <NewLine />
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
                                If all sets of all exercises are completed, the{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 3)}>
                                    workout can be ended
                                </InlinePressable>
                                .
                                <NewLine />
                                The performed workout is added to the history and is used to display the progress.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Beenden eines Workouts" : "End of a workout",
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
                                training is ended.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Übungen in Traingings bearbeiten" : "Editing an exercise in training",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Nach dem Du ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 0)}>
                                    Workout gestartet
                                </InlinePressable>{" "}
                                hast, kannst Du eine{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 1)}>
                                    Übung editieren
                                </InlinePressable>
                                , indem auf das <ThemedMaterialCommunityIcons ghost name="pencil" size={24} />
                                -Symbol neben den{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 5)}>
                                    Metadaten der Übung
                                </InlinePressable>{" "}
                                klickst. <NewLine />
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
                                , you can{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 1)}>
                                    edit an exercise
                                </InlinePressable>{" "}
                                by clicking on the <ThemedMaterialCommunityIcons ghost name="pencil" size={24} /> symbol next to the{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 5)}>
                                    metadata of the exercise
                                </InlinePressable>
                                .
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Metadaten einer Übung" : "Metadata of an exercise",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Die Metadaten einer Übung sind eine Übersicht über deiner aktuell laufenden Übung. Diese Daten entsprechen
                                den gemachten Angaben beim{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 0)}>
                                    erstellen
                                </InlinePressable>{" "}
                                oder{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 1)}>
                                    editieren
                                </InlinePressable>{" "}
                                einer Übung. <NewLine />
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 1)}>
                                    Änderst Du die Übung
                                </InlinePressable>{" "}
                                während eines Trainings, so werden die leeren Felder neu ausgefüllt, aber die bereits ausgefüllten Felder
                                bleiben unverändert.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                The metadata of an exercise is an overview of your currently running exercise. This data corresponds to the
                                information you made when{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 0)}>
                                    creating
                                </InlinePressable>{" "}
                                or{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 1)}>editing</InlinePressable>{" "}
                                an exercise. <NewLine />
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.EXERCISES, 1)}>
                                    If you change the exercise
                                </InlinePressable>{" "}
                                during a training, the empty fields will be filled in again, but the already filled fields will remain
                                unchanged.
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
                                Eine Notiz kann gemacht werden, indem auf das <ThemedMaterialCommunityIcons ghost name="note" size={24} />
                                -Symbol neben den{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 5)}>
                                    Metadaten
                                </InlinePressable>{" "}
                                einer Übung geklickt wird. <NewLine />
                                Es öffnet sich ein Dialog, in dem die Notiz gemacht werden kann. Hast Du bereits eine Notiz gemacht, so wird
                                diese im Textfeld angezeigt. <NewLine />
                                Nachdem Du die Notiz fertig geschrieben hast, drücke auf &quot;Speichern&quot;. Dieser Button befindet sich
                                am Ende des Dialogs. <NewLine />
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                During a workout it is possible to make notes for each exercise. <NewLine />
                                A note can be made by clicking on the <ThemedMaterialCommunityIcons ghost name="note" size={24} /> symbol
                                next to the{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 5)}>
                                    metadata
                                </InlinePressable>{" "}
                                of an exercise. <NewLine />
                                A dialog opens in which the note can be made. If you have already made a note, it will be displayed in the
                                text field. <NewLine />
                                After you have finished writing the note, press &quot;Save&quot;. This button is located at the end of the
                                dialog. <NewLine />
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
                                Hast Du die ausgewählte Übung in einem{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 3)}>
                                    vorherigen Workout
                                </InlinePressable>{" "}
                                bereits einmal absolviert, dann werden die Daten der letzten Durchführung unterhalb der aktuellen Übung
                                angezeigt. <NewLine />
                                Hier kannst Du sehen an welchem Datum du die Übung das letzte Mal absolviert hast und auch welche{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 4)}>
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
                                If you have already completed the selected exercise in a{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 3)}>
                                    previous workout
                                </InlinePressable>
                                , the data of the last execution will be displayed below the current exercise. <NewLine />
                                Here you can see on which date you last completed the exercise and also which{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.TRAININGS, 4)}>
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
