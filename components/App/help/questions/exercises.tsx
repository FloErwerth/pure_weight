import { HelpAnswer } from "../../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { AnswerText } from "../../../HelpQuestionAnswer/AnswerText";
import { InlinePressable } from "../../../InlinePressable/InlinePressable";
import { NewLine } from "../NewLine";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Language } from "../../../../store/reducers/settings/types";
import { QuestionAnswerArray, SECTIONS } from "../types";

export const getExercisesQuestions = (
    language: Language,
    handleSelectFromAnswer: (section: SECTIONS, index: number) => void,
): QuestionAnswerArray => {
    return [
        {
            title: language === "de" ? "Erstellung einer Übung" : "Creation of an exercise",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Um eine Übung zu bearbeiten, musst Du zuerst ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>
                                    Workout bearbeiten
                                </InlinePressable>
                                . <NewLine />
                                Anschließend kannst Du eine Übung hinzufügen, indem Du auf &quot;Übung hinzufügen&quot; am unteren Ende
                                deines Bildschirms drückst. <NewLine />
                                Es öffnet sich der Dialog zum Erstellen einer Übung. Trage nun die Daten für deine neue Übung ein.{" "}
                                <NewLine />
                                Wenn Du damit fertig bist, drücke auf &quot;Übung erstellen&quot;. Nun wird die neue Übung im Workout
                                angezeigt.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                To edit an exercise, you have to edit an{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>
                                    existing workout
                                </InlinePressable>{" "}
                                first. <NewLine />
                                In the opened workout you can then add an exercise by pressing &quot;Add exercise&quot; at the bottom of
                                your screen. <NewLine />
                                The dialog for creating an exercise will open. Now enter the data for your new exercise. <NewLine />
                                When you are done, click on &quot;Create exercise&quot;. The new exercise will now be displayed in the
                                workout.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Bearbeitung einer Übung" : "Editing of an exercise",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Um eine Übung zu bearbeiten, musst Du zuerst ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>
                                    Workout bearbeiten
                                </InlinePressable>
                                . <NewLine />
                                Im geöffneten Workout kannst Du nun auf den Namen der vorhandenen Übung klicken, um die Übung zu bearbeiten.{" "}
                                <NewLine />
                                Es öffnet sich der Dialog zum Bearbeiten einer Übung. Ändere nun die Daten deiner Übung. <NewLine />
                                Wenn Du damit fertig bist, klicke auf &quot;Bestätigen&quot; am unteren Ende des Dialogs. Der Dialog
                                schließt sich und die bearbeitete Übung wird im Workout hinterlegt.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                To edit an exercise, you have to edit an{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>
                                    existing workout
                                </InlinePressable>{" "}
                                first. <NewLine />
                                In the opened workout you can now click on the name of the existing exercise to edit the exercise.{" "}
                                <NewLine />
                                The dialog for editing an exercise will open. Now change the data of your exercise. <NewLine />
                                When you are done, click on &quot;Confirm&quot; at the bottom of the dialog. The dialog will close and the
                                edited exercise will be stored in the workout.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Löschung einer Übung" : "Deletion of an exercise",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Um eine Übung zu bearbeiten, musst Du zuerst ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>
                                    Workout bearbeiten
                                </InlinePressable>
                                . <NewLine />
                                Eine Übung kann nun gelöscht werden, indem auf das{" "}
                                <ThemedMaterialCommunityIcons ghost name="trash-can-outline" size={24} />
                                -Symbol neben dem Namen der Übung geklickt wurde. <NewLine />
                                Es erscheint ein Dialog, ob Du dir sicher bist, dass Du die Übung löschen möchtest. Bestätige nun die
                                Löschung der Übung. <NewLine />
                                Die Übung wird nun aus dem Workout gelöscht. Eine gelöschte Übung kann nicht wiederhergestellt werden,
                                nachdem{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.MISCELLANEOUS, 0)}>
                                    das Zeitfenster
                                </InlinePressable>{" "}
                                für das Rückgängig machen abgelaufen ist.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                To delete an exercise, you first have to create a{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)}>
                                    new workout
                                </InlinePressable>{" "}
                                or edit an{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>
                                    existing workout
                                </InlinePressable>
                                . <NewLine />
                                An exercise can now be deleted by clicking on the{" "}
                                <ThemedMaterialCommunityIcons ghost name="trash-can-outline" size={24} /> symbol next to the name of the
                                exercise. <NewLine />
                                A dialog appears asking if you are sure you want to delete the exercise. Now confirm the deletion of the
                                exercise. <NewLine />
                                The exercise will now be deleted from the workout. A deleted exercise cannot be restored after{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.MISCELLANEOUS, 0)}>
                                    the time window
                                </InlinePressable>{" "}
                                for undoing has expired.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Reihenfolge der Übungen" : "Order of the exercises",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Um die Reihenfolge der Übungen ändern zu können musst Du zuerst ein{" "}
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>
                                    Workout bearbeiten
                                </InlinePressable>
                                . <NewLine />
                                Außerdem müssen mindestens zwei Übungen im Workout vorhanden sein. <NewLine />
                                Die Reihenfolge der Übungen kann nun geändert werden, indem Du etwas länger auf das{" "}
                                <ThemedMaterialCommunityIcons name="drag" size={24} ghost />
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
                                <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.WORKOUTS, 2)}>workout</InlinePressable>.{" "}
                                <NewLine />
                                At least two exercises must also be present in the workout. <NewLine />
                                The order of the exercises can now be changed by pressing a little longer on the{" "}
                                <ThemedMaterialCommunityIcons name="drag" size={24} ghost /> symbol next to the{" "}
                                <ThemedMaterialCommunityIcons name="trash-can-outline" size={24} ghost /> symbol of an exercise and then
                                dragging it to the desired position. <NewLine />
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
    ];
};
