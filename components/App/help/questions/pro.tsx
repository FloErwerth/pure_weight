import { Language } from "../../../../store/reducers/settings/types";
import { QuestionAnswerArray } from "../types";
import { HelpAnswer } from "../../../HelpQuestionAnswer/HelpQuestion";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { AnswerText } from "../../../HelpQuestionAnswer/AnswerText";
import { NewLine } from "../NewLine";
import { InlinePressable } from "../../../InlinePressable/InlinePressable";
import { styles } from "../styles";

export const getProQuestions = (language: Language, handleNavigateToPurchase: () => void): QuestionAnswerArray => {
    return [
        {
            title: language === "de" ? "Kann ich die PRO-Version kostenlos testen?" : "Can I try the PRO version for free?",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Ja! Du kannst alle Funktionen der PRO-Versionen für einen Monat kostenlos testen. Dies gilt aber nur für Abos. <NewLine /> Dein Bankkonto wird nur belastet, wenn du
                                nicht bis 24 Stunden vor Ablauf der Testphase dein Abo im App Store kündigst.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Yes! You can try all the features of the PRO version for a month for free. This only applies to subscriptions. <NewLine />
                                Your bank account will only be charged if you do not cancel your subscription in the App Store 24 hours before the end of the trial period.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Wie kann ich die PRO-Version kündigen?" : "How can I cancel the subscription?",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Öffne im App Store und gehe auf Profil &#8250; Abos &#8250; Pure Weight. Hier kannst du dein Abo kündigen. <NewLine />
                                Du musst dein Abo mindestens 24 Stunden vor Ablauf des Abrechnungszeitraums kündigen, damit die Kündigung rechtzeitig wirksam wird.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Open the App Store and go to Profile &#8250; Subscriptions &#8250; Pure Weight. Here you can cancel your subscription. <NewLine />
                                You must cancel your subscription at least 24 hours before the end of the billing period for the cancellation to take effect in time.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Die PRO-Version ist trotz gekaufter App oder Abo nicht aktiv." : "The PRO version is not active despite the purchased app or subscription.",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Bitte navigiere auf die <InlinePressable handlePress={handleNavigateToPurchase}>Kaufseite</InlinePressable> und drücke dort auf &quot;Wiederherstellen&quot;.
                                <NewLine />
                                Sollte das nicht helfen, kontaktiere bitte den Support.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Please navigate to the <InlinePressable handlePress={handleNavigateToPurchase}>purchase page</InlinePressable> and press &quot;Restore&quot; there.
                                <NewLine />
                                If that does not help, please contact support.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
        {
            title: language === "de" ? "Kann ich die PRO-Version auch auf einem neuen Endgerät nutzen?" : "Can I also use the PRO version on a new device?",
            answer:
                language === "de" ? (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Ja! All deine Käufe sind im App Store gespeichert. Wechselst Du dein Gerät, kannst Du auf die{" "}
                                <InlinePressable handlePress={handleNavigateToPurchase}>Kaufseite</InlinePressable> gehen und dort auf &quot;Wiederherstellen&quot; drücken. Nun werden deine Käufe über
                                den App Store geprüft und auf dein Gerät übertragen.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ) : (
                    <HelpAnswer>
                        <ThemedView ghost stretch style={styles.bigGap}>
                            <AnswerText>
                                Yes! All your purchases are stored in the App Store. If you change your device, you can go to the{" "}
                                <InlinePressable handlePress={handleNavigateToPurchase}>purchase page</InlinePressable> and press &quot;Restore&quot; there. Now your purchases will be checked via the
                                App Store and transferred to your device.
                            </AnswerText>
                        </ThemedView>
                    </HelpAnswer>
                ),
        },
    ];
};
