import { HelpAnswer } from "../../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { AnswerText } from "../../../HelpQuestionAnswer/AnswerText";
import { InlinePressable } from "../../../InlinePressable/InlinePressable";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { NewLine } from "../NewLine";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { Text } from "../../../Themed/ThemedText/Text";
import { Language } from "../../../../store/reducers/settings/types";
import { QuestionAnswerArray, SECTIONS } from "../types";

export const getWorkoutsQuestions = (
    language: Language,
    handleNavigateToWorkouts: () => void,
    handleSelectFromAnswer: (section: SECTIONS, index: number) => void,
    setupNewWorkout: () => void,
): QuestionAnswerArray => {
    return [
        {
            title: language === "de" ? "Ein Workout erstellen" : "Creating a workout",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    Navigiere zu Workouts
                                </InlinePressable>
                                , klicke auf das{" "}
                                <ThemedMaterialCommunityIcons name="plus" size={24} ghost />
                                -Symbol. Nun wirst Du zur Workout-Erstellung weitergeleitet.{" "}
                                <NewLine />
                                Hier kannst Du nun einen Namen und eine Farbe für dein Workout
                                einstellen. Die Farbe wird dazu verwendet, um das Workout in der
                                Übersicht und in der{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.WORKOUTS, 6)
                                    }>
                                    Historie
                                </InlinePressable>{" "}
                                zu markieren. <NewLine />
                                Außerdem kannst Du{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.EXERCISES, 0)
                                    }>
                                    Übungen erstellen
                                </InlinePressable>
                                , welche Du in deinem Workout absolvieren möchtest.
                                <NewLine />
                                Wenn Du fertig bist, klicke auf das{" "}
                                <ThemedMaterialCommunityIcons name="check" size={24} ghost />
                                -Symbol oben rechts im Workout-Erstellen Bildschirm.
                            </AnswerText>
                            <ThemedPressable onPress={setupNewWorkout} center padding round>
                                <Text style={{ fontSize: 16 }}>
                                    Klicke hier, um sofort ein neues Workout zu erstellen
                                </Text>
                            </ThemedPressable>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    Navigate to the workouts
                                </InlinePressable>
                                , click on the{" "}
                                <ThemedMaterialCommunityIcons name="plus" size={24} ghost /> symbol.
                                Now you will be redirected to the workout creation. <NewLine />
                                Here you can set a name and a color for your workout. The color is
                                used to mark the workout in the overview and in the{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.WORKOUTS, 6)
                                    }>
                                    history
                                </InlinePressable>
                                . <NewLine />
                                You can also{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.EXERCISES, 0)
                                    }>
                                    create exercises
                                </InlinePressable>{" "}
                                that you want to do in your workout.
                                <NewLine />
                                When you are done, click on the{" "}
                                <ThemedMaterialCommunityIcons name="check" size={24} ghost /> symbol
                                in the top right corner of the workout creation screen.
                            </AnswerText>
                            <ThemedPressable onPress={setupNewWorkout} center padding round>
                                <Text style={{ fontSize: 16 }}>
                                    Click here to create a new workout immediately
                                </Text>
                            </ThemedPressable>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Bearbeitung eines Workouts" : "Editing a workout",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Um ein Workout zu bearbeiten, benötigst Du zuerst ein vorhandenes{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)
                                    }>
                                    Workout
                                </InlinePressable>
                                .
                                <NewLine />
                                Navigiere zu den{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    Workouts
                                </InlinePressable>{" "}
                                und wische dann das gewünschte Workout nach rechts. <NewLine />
                                Nun wirst Du zur Workout Bearbeitung navigiert und kannst das
                                gewünschte Workout bearbeiten.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                To edit a workout, you first need an existing{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.WORKOUTS, 0)
                                    }>
                                    workout
                                </InlinePressable>
                                .
                                <NewLine />
                                Navigate to the{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    workouts
                                </InlinePressable>{" "}
                                and swipe the desired workout to the right. <NewLine />
                                You will now be navigated to the workout editing and can edit the
                                workout as desired.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Löschung eines Workouts" : "Deleting a workout",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Um ein Workout zu löschen, navigiere zu den{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    Workouts
                                </InlinePressable>{" "}
                                und wische das gewünschte Workout nach links. <NewLine />
                                Dieses Workout wird nun gelöscht. Ein gelöschtes Workout kann nicht
                                wiederhergestellt werden, nachdem{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.MISCELLANEOUS, 0)
                                    }>
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
                                To delete a workout, navigate to the{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    workouts
                                </InlinePressable>{" "}
                                and swipe the desired workout to the left. <NewLine />
                                This workout will now be deleted. A deleted workout cannot be
                                restored after{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.MISCELLANEOUS, 0)
                                    }>
                                    the time window
                                </InlinePressable>{" "}
                                for undoing has expired.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Sortierung von Workouts" : "Sorting of workouts",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Erstellte{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    Workouts
                                </InlinePressable>{" "}
                                können in der Übersicht sortiert werden. <NewLine />
                                Es gibt vier Sortierungsmöglichkeiten: <NewLine />
                                Alphabetisch aufsteigend <NewLine numberOfLines={1} />
                                Alphabetisch absteigend <NewLine numberOfLines={1} />
                                Am längsten her <NewLine numberOfLines={1} />
                                Vor kürzester Zeit <NewLine />
                                Um die Sortierung zu ändern, klicke auf den Sortierungs-Button
                                unterhalb des Titels der Workout Übersicht. <NewLine />
                                Es öffnet sich nun ein Dialog, in dem die Sortierung ausgewählt
                                werden kann.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Created{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    workouts
                                </InlinePressable>{" "}
                                can be sorted in the overview. <NewLine />
                                There are four sorting options: <NewLine />
                                Alphabetically ascending <NewLine numberOfLines={1} />
                                Alphabetically descending <NewLine numberOfLines={1} />
                                Longest ago <NewLine numberOfLines={1} />
                                Most recently <NewLine />
                                To change the sorting, click on the sorting button below the title
                                of the workout overview. <NewLine />A dialog will now open in which
                                the sorting can be selected.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Performance eines Workouts" : "Performance of a workout",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Innerhalb der Kachel eines{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    erstellten Workouts
                                </InlinePressable>{" "}
                                befindet sich eine Anzeige zu deiner Performance im Workout.{" "}
                                <NewLine />
                                Diese wird nur angezeigt, wenn Du das Workout bereits mindestens
                                zweimal durchgeführt hast und es mindestens eine Übung innerhalb des
                                Workouts gibt, welches Du mindestens zweimal abgeschlossen hast.{" "}
                                <NewLine />
                                Die Anzeige zeigt an, wie sich deine Leistung vom letzten zum
                                aktuellen Workout verändert hat. <NewLine />
                                Ein Klick auf die Performance-Anzeige leitet dich zu den
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.WORKOUTS, 5)
                                    }>
                                    Leistungstrend
                                </InlinePressable>{" "}
                                des Workouts weiter. <NewLine />
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Inside the tile of a{" "}
                                <InlinePressable handlePress={handleNavigateToWorkouts}>
                                    created workout
                                </InlinePressable>{" "}
                                there is a display of your performance of that workout. <NewLine />
                                This is only displayed if you have already performed the workout at
                                least twice and there is at least one exercise within the workout
                                that you have completed twice. <NewLine />
                                The display shows how your performance has changed from the last to
                                the current workout. <NewLine />
                                Clicking on the performance display will take you to the{" "}
                                <InlinePressable
                                    handlePress={() =>
                                        handleSelectFromAnswer(SECTIONS.WORKOUTS, 5)
                                    }>
                                    performance trend
                                </InlinePressable>{" "}
                                of the workout. <NewLine />
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Leistungstrends" : "Performance trends",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Ein Leistungstrend zeigt Dir an, wie sich deine Leistung innerhalb
                                eines Workouts verändert hat. <NewLine />
                                Es werden die Workout-Daten pro Tag angezeigt. Es können maximal die
                                letzten 100 Übungen eines Workouts angezeigt werden. <NewLine />
                                Der Leistungstrend zeigt standardmäßig das bewegte Gesamtgewicht pro
                                Tag an. Diese Option heißt &quot;Kumulativ&quot;. <NewLine />
                                Es gibt noch zwei weitere Möglichkeiten, den Leistungstrend anzeigen
                                zu lassen: <NewLine />
                                Durchschnittliche Anzahl von Wiederholungen{" "}
                                <NewLine numberOfLines={1} />
                                Durchnittliches Gewicht pro Übung <NewLine />
                                Diese Einstellungen können individuell pro Übung im Leistungstrend
                                angepasst werden.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                The performance trend shows you how your performance has changed
                                within a workout. <NewLine />
                                The workout data is displayed per day. A maximum of the last 100
                                exercises of a workout can be displayed. <NewLine />
                                The performance trend shows the total weight moved per day by
                                default. This option is called &quot;cumulative&quot;. <NewLine />
                                There are two other ways to display the performance trend:{" "}
                                <NewLine />
                                Average number of repetitions <NewLine numberOfLines={1} />
                                Average weight per exercise <NewLine />
                                These settings can be adjusted individually per exercise in the
                                performance trend.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Historie" : "History",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Wenn Du mindestens ein Workout abgeschlossen hast wird innerhalb der
                                Workout-Kachel ein Indikator für deine Workout-Historie angezeigt.{" "}
                                <NewLine />
                                Der Indikator zeigt an wie viele Workouts du abgeschlossen hast und
                                leitet dich bei Klick zur Historie weiter. <NewLine />
                                Die Historie zeigt Statistiken zu allen Workouts eines Monats an.{" "}
                                <NewLine />
                                Bei Klick auf &quot;Verlauf durchsuchen&quot; kannst Du die Historie
                                nach einem bestimmten Monat durchsuchen. <NewLine />
                                Es öffnet sich ein Kalender, in dem die absolvierten Workouts mit
                                deiner Workout-Farbe markiert sind. Die markierten Tage können
                                angeklickt werden. Der aktuell ausgewählte Tag wird komplett mit
                                deiner Farbe ausgefüllt. Ein auswählbarer Tag mit einem kleinen
                                Punkt. <NewLine />
                                Bei Klick auf einen auswählbares Workout wird der Kalender
                                geschlossen und Du wirst zum Monat des ausgewählten Workout
                                geleitet.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                If you have completed at least one workout, an indicator for your
                                workout history will be displayed within the workout tile.{" "}
                                <NewLine />
                                The indicator shows how many workouts you have completed and takes
                                you to the history when clicked. <NewLine />
                                The history shows statistics for all workouts of a month.{" "}
                                <NewLine />
                                When you click on &quot;Browse history&quot; you can browse the
                                history for a specific month. <NewLine />A calendar opens in which
                                the completed workouts are marked with your workout color. The
                                marked days can be clicked. The currently selected day is completely
                                filled with your color. A selectable day with a small dot.{" "}
                                <NewLine />
                                If you click on a selectable workout, the calendar will close and
                                you will be taken to the month of the selected workout.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title:
                language === "de"
                    ? "Bearbeiten von abgeschlossenen Workouts"
                    : "Editing completed workouts",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Um ein abgeschlossenes Workout zu bearbeiten, navigiere zur Historie
                                und drücke auf das gewünschte Workout. Du wirst nun zur
                                Bearbeitungsansicht weitergeleitet. <NewLine />
                                Hier siehst du eine Auflistung der absolvierten Sätze pro Übung.{" "}
                                <NewLine />
                                Falls deine Übung eine gewichtsbasierte Übung ist Du kannst hier das
                                Gewicht und die Wiederholungszahl ändern. Andernfalls kannst Du die
                                Dauer deiner Übung ändern. <NewLine />
                                Wenn Du mit der Bearbeitung fertig bist klicke auf das{" "}
                                <ThemedMaterialCommunityIcons
                                    name="content-save-outline"
                                    size={24}
                                    ghost
                                />{" "}
                                Symbol oben rechts. Wenn Du die Bearbeitung abbrechen möchtest
                                navigiere auf die vorherige Seite zurück. <NewLine />
                                Es wird nun ein Dialog angezeigt bei dem Du entscheiden möchtest was
                                mit deinen eingebenen Daten passiert. Du kannst die Änderungen
                                speichern oder verwerfen.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                To edit a completed workout, navigate to the history and press the
                                desired workout. You will now be taken to the editing view.{" "}
                                <NewLine />
                                Here you will see a list of the completed sets per exercise.{" "}
                                <NewLine />
                                If your exercise is a weight-based exercise, you can change the
                                weight and the number of repetitions here. Otherwise, you can change
                                the duration of your exercise. <NewLine />
                                When you are finished editing, click on the{" "}
                                <ThemedMaterialCommunityIcons
                                    name="content-save-outline"
                                    size={24}
                                    ghost
                                />{" "}
                                symbol in the top right. If you want to cancel the editing, navigate
                                back to the previous page. <NewLine />A dialog will now be displayed
                                asking you what to do with your entered data. You can save or
                                discard the changes.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
    ];
};
