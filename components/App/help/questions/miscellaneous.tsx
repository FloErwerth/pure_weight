import { HelpAnswer } from "../../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { AnswerText } from "../../../HelpQuestionAnswer/AnswerText";
import { NewLine } from "../NewLine";
import { InlinePressable } from "../../../InlinePressable/InlinePressable";
import { Language } from "../../../../store/reducers/settings/types";
import { QuestionAnswerArray } from "../types";

export const getMiscellaneousQuestions = (navigateToSettings: (sectionIndex: number) => void, language: Language): QuestionAnswerArray => {
    return [
        {
            title: language === "de" ? "Löschung Rückgängig machen" : "Undo deletion",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                Nachdem Du etwas gelöscht hast, erscheint am unteren Bildschirmrand ein Hinweis, dass etwas gelöscht wurde.
                                Klicke auf den Hinweis, um die Löschung rückgängig zu machen. Dieser Hinweis wird nach einiger Zeit
                                automatisch verschwinden.
                                <NewLine /> Nach dem Ablauf dieser Zeit kann die Löschung nicht rückgängig gemacht werden. Die Zeit für die
                                Rückgängig-Machung kann in den{" "}
                                <InlinePressable handlePress={() => navigateToSettings(0)}>allgemeinen Einstellungen</InlinePressable> unter
                                &quot;Löschzeit&quot; geändert werden.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                After you have deleted something, a message will appear at the bottom of the screen that something has been
                                deleted.
                                <NewLine /> Click on the message to undo the deletion. This message will automatically disappear after a
                                certain time.
                                <NewLine /> After this time has expired, the deletion cannot be undone. The time for undoing can be changed
                                in the <InlinePressable handlePress={() => navigateToSettings(0)}>general settings</InlinePressable> under
                                &quot;Deletion time&quot;.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
    ];
};
