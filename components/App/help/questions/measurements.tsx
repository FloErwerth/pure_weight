import { QuestionAnswerArray, SECTIONS } from "../types";
import { HelpAnswer } from "../../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { AnswerText } from "../../../HelpQuestionAnswer/AnswerText";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Language } from "../../../../store/reducers/settings/types";
import { InlinePressable } from "../../../InlinePressable/InlinePressable";
import { NewLine } from "../NewLine";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { Text } from "../../../Themed/ThemedText/Text";
import { MeasurementType, measurementTypes, MeasurementUnit } from "../../measurements/types";
import { ReactNode } from "react";
import { styles } from "../styles";

const getUnitText = (language: Language, unit: MeasurementType, measurmentOptionMap: Record<MeasurementType, string>): ReactNode => {
    switch (unit) {
        case MeasurementUnit.Enum.weight:
            return language === "de" ? (
                <>
                    Gewicht ({measurmentOptionMap[unit]}): Zum Beispiel dein Körpergewicht. <NewLine />
                </>
            ) : (
                <>
                    Weight: ({measurmentOptionMap[unit]}): For example the your body weight. <NewLine />
                </>
            );
        case MeasurementUnit.Enum.length:
            return language === "de" ? (
                <>
                    Länge ({measurmentOptionMap[unit]}): Zum Beispiel der Umfang deines rechten Bizeps. <NewLine />
                </>
            ) : (
                <>
                    Length ({measurmentOptionMap[unit]}): For example the the circumference of your right biceps.
                    <NewLine />
                </>
            );
        case MeasurementUnit.Enum.percent:
            return language === "de" ? (
                <>
                    Prozent (%): Zum Beispiel deine Körperfettanteil. <NewLine />
                </>
            ) : (
                <>
                    Percent (%): For example your body fat percentage.
                    <NewLine />
                </>
            );
    }
};

export const getMeasurementQuestions = (
    language: Language,
    handleNavigateToMeasurements: () => void,
    handleSelectFromAnswer: (section: SECTIONS, index: number) => void,
    handleCreateNewMeasurement: () => void,
    measurmentOptionMap: Record<MeasurementType, string>,
): QuestionAnswerArray => {
    const showHigherIsBetter = () => handleSelectFromAnswer(SECTIONS.MEASUREMENTS, 5);
    const showUnit = () => handleSelectFromAnswer(SECTIONS.MEASUREMENTS, 3);
    const showDate = () => handleSelectFromAnswer(SECTIONS.MEASUREMENTS, 4);
    const showTimeWindow = () => handleSelectFromAnswer(SECTIONS.MISCELLANEOUS, 0);

    return [
        {
            title: language === "de" ? "Erstellung einer Messung" : "Creating a measurement",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Um eine Messung erstellen zu können navigiere zu den <InlinePressable handlePress={handleNavigateToMeasurements}>Messungen</InlinePressable> und drücke auf das
                                <ThemedMaterialCommunityIcons ghost name="plus" size={24} />
                                -Symbol auf dem oberen rechten Bildschirmrand. <NewLine />
                                Nun kannst Du einen Namen und einen Wert eingeben. <NewLine />
                                Außerdem kannst Du auswählen, ob es für deine Messung besser ist, wenn der Wert höher ist. <InlinePressable handlePress={showHigherIsBetter}>Mehr dazu</InlinePressable>
                                . <NewLine />
                                Wähle auch eine <InlinePressable handlePress={showUnit}>Einheit</InlinePressable> und ein <InlinePressable handlePress={showDate}>Datum</InlinePressable> für deine
                                Messung aus. <NewLine />
                                Nachdem Du deine Messung erstellt hast, drücke auf &quot;Messung erstellen&quot;. Deine Messung wird nun in der Übersicht deiner{" "}
                                <InlinePressable handlePress={handleNavigateToMeasurements}>Messungen</InlinePressable> angezeigt.
                            </AnswerText>
                            <ThemedPressable safeBottom onPress={handleCreateNewMeasurement} center padding round>
                                <Text style={styles.createText}>Klicke hier, um sofort eine neue Messung zu erstellen</Text>
                            </ThemedPressable>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                To create a measurement, navigate to the <InlinePressable handlePress={handleNavigateToMeasurements}>measurements</InlinePressable> and click on the{" "}
                                <ThemedMaterialCommunityIcons ghost name="plus" size={24} /> symbol on the top right of the screen. <NewLine />
                                Now you can enter a name and a value for your measurement. <NewLine />
                                You can also select whether it is better for your measurement if the value is higher. <InlinePressable handlePress={showHigherIsBetter}>Learn more</InlinePressable>
                                . <NewLine />
                                Also select a <InlinePressable handlePress={() => handleSelectFromAnswer(SECTIONS.MEASUREMENTS, 3)}>unit</InlinePressable> and a{" "}
                                <InlinePressable handlePress={showDate}>date</InlinePressable> for your measurement. <NewLine />
                                After you have created your measurement, click on &quot;Create measurement&quot;. Your measurement will now be displayed in the overview of your{" "}
                                <InlinePressable handlePress={handleNavigateToMeasurements}>measurements</InlinePressable>.
                            </AnswerText>
                            <ThemedPressable safeBottom onPress={handleCreateNewMeasurement} center padding round>
                                <Text style={styles.createText}>Press here to create a new measurement</Text>
                            </ThemedPressable>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Bearbeitung eines Messpunkts" : "Editing measurement data",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Um einen Messpunkt zu bearbeiten, navigiere zu den <InlinePressable handlePress={handleNavigateToMeasurements}>Messungen</InlinePressable> und ziehe die zu bearbeitende
                                Messung nach rechts. <NewLine />
                                Du gelangst zu einer Übersicht über aller gemachten Messpunkte deiner ausgewählten Messung. Drücke auf den Messpunkt, welchen Du bearbeiten möchtest. <NewLine />
                                Du wirst nun zur Bearbeitungsansicht weitergeleitet, welche dem Dialog der Erstellung der Messung ähnelt. Du kannst hier jedoch nur den Wert und das Datum ändern.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                To edit a measurement data point, navigate to the <InlinePressable handlePress={handleNavigateToMeasurements}>measurements</InlinePressable> and swipe the measurement
                                to be edited to the right. <NewLine />
                                You will be taken to an overview of all the measurement data points of your selected measurement. Press on the measurement data point you want to edit. <NewLine />
                                You will now be redirected to the editing view, which is similar to the dialog of creating the measurement. However, you can only change the value and the date here.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Löschen von Messungen" : "Deleting a measurement",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Willst Du eine Messung löschen, so <InlinePressable handlePress={handleNavigateToMeasurements}>Navigiere zu den Messungen</InlinePressable> und wische die zu löschende
                                Messung nach links. Deine Messung wird nun gelöscht. <NewLine />
                                Die Löschung kann rückgängig gemacht werden, indem Du auf den Button im Hinweis am unteren Bildschirmrand drückst.{" "}
                                <InlinePressable handlePress={showTimeWindow}>Mehr dazu</InlinePressable>.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                If you want to delete a measurement, <InlinePressable handlePress={handleNavigateToMeasurements}>navigate to the measurements</InlinePressable> and swipe the
                                measurement to be deleted to the left. Your measurement will now be deleted. <NewLine />
                                The deletion can be undone by pressing the button in the message at the bottom of the screen. <InlinePressable handlePress={showTimeWindow}>Learn more</InlinePressable>
                                .
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Einheiten von Messungen" : "Units of measurements",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Eine Messung kann drei verschiedene Arten von Einheiten haben: <NewLine />
                                {measurementTypes.map((unit) => getUnitText(language, unit, measurmentOptionMap))}
                                Die Auswahl des Einheitentyps erfolgt über ein Dropdown-Menü.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                A measurement can have three different types of units: <NewLine />
                                {measurementTypes.map((unit) => getUnitText(language, unit, measurmentOptionMap))}
                                The selection of the unit type is done via a dropdown menu.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Datum deiner Messung" : "Date of your measurement",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Es kann immer nur eine Messung pro Tag geben. Wählst Du ein Datum aus, an dem schon eine Messung vorhanden ist, so wirst Du beim ersten Versuch der Erstellung deiner
                                Messung eine Warnung sehen. <NewLine />
                                Drückst Du erneut auf &quot;Messung hinzufügen&quot;, so wird die vorhandene Messung durch die neue Messung ersetzt.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                There can only be one measurement per day. If you select a date on which a measurement already exists, you will see a warning when you first try to create your
                                measurement. <NewLine />
                                If you press &quot;Add measurement&quot; again, the existing measurement will be replaced by the new measurement.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Höher ist besser" : "Higher is better",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Diese Option gibt an ob es besser ist, wenn der Wert einer Messung steigt oder fällt. <NewLine /> Dies hat nur Auswirkungen auf die Anzeige der Prognose in einer
                                Messung, welche in der <InlinePressable handlePress={handleNavigateToMeasurements}>Übersicht deiner Messungen</InlinePressable> angezeigt wird.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                This option indicates whether it is better if the value of a measurement increases or decreases. <NewLine /> This only affects the display of the forecast in a
                                measurement, which is displayed in the <InlinePressable handlePress={handleNavigateToMeasurements}>overview of your measurements</InlinePressable>.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Trends von Messungen" : "Measurement trends",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Beim Drücken auf die Trendanzeige unterhalb des Namens einer Messung in der{" "}
                                <InlinePressable handlePress={handleNavigateToMeasurements}>Übersicht deiner Messungen</InlinePressable> wirst Du zur Trendansicht weitergeleitet. <NewLine />
                                Der Trend von Messungen zeigt Dir an, wie sich deine Messung im Laufe der Zeit verändert hat.
                                <NewLine />
                                Es können maximal die letzten 100 Messungen angezeigt werden.{" "}
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                When you press the trend display below the name of a measurement in the{" "}
                                <InlinePressable handlePress={handleNavigateToMeasurements}>overview of your measurements</InlinePressable> you will be redirected to the trend view. <NewLine />
                                The trend of measurements shows you how your measurement has changed over time.
                                <NewLine />A maximum of the last 100 measurements can be displayed.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
    ];
};
