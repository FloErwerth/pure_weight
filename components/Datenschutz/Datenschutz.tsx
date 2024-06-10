import { HThree, HTwo, Li, Paragraph } from "../HTML";
import { ThemedView } from "../Themed/ThemedView/View";
import { RefObject, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { useAppSelector } from "../../store";
import { getLanguage } from "../../store/selectors/settings/settingsSelectors";
import { NewLine } from "../App/help/NewLine";
import { Text } from "../Themed/ThemedText/Text";
import { PageContent } from "../PageContent/PageContent";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

type DatenschutzProps = {
    reference: RefObject<BottomSheetModal>;
};

export const Datenschutz = ({ reference }: DatenschutzProps) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTypedTranslation();

    const EnglischDatenschutz = useCallback(
        () => (
            <ThemedView ghost>
                <HTwo>1. Controller</HTwo>
                <Paragraph>
                    The controller within the meaning of the General Data Protection Regulation (GDPR) and other national data protection laws of the member states as well as other data protection
                    regulations is:
                </Paragraph>
                <Paragraph>
                    <ThemedView ghost>
                        <Text ghost>Florian Erwerth</Text>
                        <Text ghost>Balanstraße 93</Text>
                        <Text ghost>81539 München</Text>
                        <Text ghost>Deutschland</Text>
                        <Text ghost>E‑Mail: pureweight.app@gmail.com</Text>
                    </ThemedView>
                </Paragraph>
                <Paragraph>
                    <HTwo>2. General</HTwo>
                    <HThree>2.1 Scope of processing of personal data</HThree>
                    <Paragraph>We do not process any personal data of our users in Pure Weight.</Paragraph>
                    <HThree>2.2. Legal basis for the processing of personal data</HThree>
                    <Paragraph>
                        Even if Pure Weight does not process data, we are obliged to specify the legal basis for the processing of personal data.
                        <NewLine numberOfLines={1} />
                        <NewLine numberOfLines={1} /> Data If the legal basis is not mentioned in our data protection declaration, the processing of personal data is based on the following legal
                        bases: Insofar as we obtain the consent of the data subject for processing operations of personal data, Article 6 (1) lit. a EU General Data Protection Regulation (GDPR) serves
                        as the legal basis. When processing personal data that is necessary for the performance of a contract to which the data subject is a party, Article 6 (1) lit. b GDPR serves as
                        the legal basis. This also applies to processing operations that are necessary to carry out pre-contractual measures. Insofar as the processing of personal data is necessary to
                        fulfill a legal obligation to which our company is subject, Article 6 (1) lit. c GDPR serves as the legal basis. In the event that vital interests of the data subject or
                        another natural person require the processing of personal data, Article 6 (1) lit. d GDPR serves as the legal basis. If the processing is necessary to safeguard a legitimate
                        interest of our company or a third party and the interests, fundamental rights and freedoms of the data subject do not outweigh the first-mentioned interest, Article 6 (1) lit.
                        f GDPR serves as the legal basis for the processing.
                    </Paragraph>
                    <HThree>2.3. Data deletion and storage duration</HThree>
                    <Paragraph>Since no data is processed, there is also no storage period or deletion of data.</Paragraph>
                    <HTwo>3. Data that you enter yourself in the app</HTwo>
                    <HThree>3.1. Description and scope of data processing</HThree>
                    <ThemedView ghost>
                        <Paragraph>In order to be able to track workouts with Pure Weight, the following data must be stored on the end device:</Paragraph>
                        <Paragraph>
                            <ThemedView ghost>
                                <Text ghost>Florian Erwerth</Text>
                                <Text ghost>Balanstraße 93</Text>
                                <Text ghost>81539 München</Text>
                                <Text ghost>Deutschland</Text>
                                <Text ghost>E‑Mail: pureweight.app@gmail.com</Text>
                            </ThemedView>
                        </Paragraph>
                        <Paragraph>This data is then also used to present training progress.</Paragraph>
                    </ThemedView>
                    <HThree>3.2. Legal basis for data processing</HThree>
                    <Paragraph>
                        The legal basis for the processing of the personal data that you enter yourself in the app is Art. 6 para. 1 lit. b DSGVO, since the collection of this data is necessary for
                        the performance of a contract to which the user is a party or for the implementation of pre-contractual measures.
                    </Paragraph>
                    <HThree>3.3. Purpose of data processing</HThree>
                    <Paragraph>We store data that you enter yourself in Pure Weight on the end device in order to:</Paragraph>
                    <ThemedView ghost>
                        <Paragraph>
                            <Li>show the training progress</Li>
                            <Li>display the training date and duration</Li>
                            <Li>to be able to display a summary of the previously completed training</Li>
                            <Li>show the measurement progress</Li>
                        </Paragraph>
                    </ThemedView>
                    <HThree>3.4. Duration of storage</HThree>
                    <Paragraph>All data is deleted as soon as Pure Weight is uninstalled.</Paragraph>
                    <HThree>3.5 Objection and elimination option</HThree>
                    <Paragraph>
                        Since all data remains on the end device, the user has full control over the data mentioned in point 3.1 and point 3.2 at all times. An objection or elimination option is
                        therefore not necessary.
                    </Paragraph>
                    <HTwo>4. Establishment of a contractual relationship</HTwo>
                    <HThree>4.1. Description and scope of data processing</HThree>
                    <Paragraph>
                        The subscription is concluded via the App Store operated by Apple. The relevant data such as your Apple ID, date of purchase, start and end date or your payment information are
                        processed and stored there in order to enable payment and use of the subscription. We use the service RevenueCat (RevenueCat, Inc. 633 Tarava St. Suite 101, San Francisco, CA
                        94116, USA) to transmit the subscription purchases.
                    </Paragraph>

                    <Paragraph>
                        The privacy policy of Apple can be found here: https://www.apple.com/de/privacy <NewLine numberOfLines={1} />
                        The privacy policy of RevenueCat can be found here: https://www.revenuecat.com/privacy
                    </Paragraph>
                    <HThree>4.2. Legal basis for data processing</HThree>
                    <Paragraph>
                        The legal basis for the processing of personal data is Art. 6 para. 1 lit. b DSGVO, since the collection of this data is necessary for the performance of a contract to which
                        the user is a party or for the implementation of pre-contractual measures.
                    </Paragraph>
                    <HThree>4.3. Purpose of data processing</HThree>
                    <Paragraph>The processing of personal data serves the processing of the subscription and the payment.</Paragraph>
                    <HThree>4.4. Duration of storage</HThree>
                    <Paragraph>The duration of data storage can be found in Apple&apos;s privacy policy and in the privacy policy of RevenueCat.</Paragraph>
                    <Paragraph>
                        The privacy policy of Apple can be found here: https://www.apple.com/de/privacy <NewLine numberOfLines={1} />
                        The privacy policy of RevenueCat can be found here: https://www.revenuecat.com/privacy
                    </Paragraph>
                    <HThree>4.5 Objection and elimination option</HThree>
                    <Paragraph>Since the data is processed by Apple, the objection and elimination option can be found in Apple&apos;s privacy policy. (https://www.apple.com/de/privacy).</Paragraph>
                    <HTwo>5. Google Fonts</HTwo>
                    <Paragraph>
                        Our website uses Google Fonts fonts (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA). The provider&apos;s privacy policy can be found here:
                        https://www.google.com/policies/privacy
                    </Paragraph>
                    <HTwo>6. Rights of the data subject</HTwo>

                    <HThree>6.1 Rights for information</HThree>
                    <Paragraph>
                        You can request confirmation from the person responsible as to whether personal data concerning you is being processed by us. If such processing is available, you can request
                        information from the person responsible about the following information:
                    </Paragraph>
                    <ThemedView ghost>
                        <Paragraph>
                            <Li>the purposes for which the personal data are processed</Li>
                            <Li>the categories of personal data that are processed</Li>
                            <Li>the recipients or the categories of recipients to whom the personal data concerning you have been disclosed or are still being disclosed</Li>
                            <Li>the planned duration of the storage of the personal data concerning you or, if specific information is not possible, criteria for determining the storage period</Li>
                            <Li>
                                the existence of a right to correct or delete personal data concerning you, a right to restrict processing by the person responsible or a right to object to this
                                processing
                            </Li>
                            <Li>the existence of a right to lodge a complaint with a supervisory authority</Li>
                            <Li>all available information on the origin of the data if the personal data are not collected from you</Li>
                            <Li>
                                the existence of automated decision-making, including profiling in accordance with Art. 22 Para. 1 and 4 GDPR and – at least in these cases – meaningful information
                                about the logic involved and the scope and intended effects of such processing for you.
                            </Li>
                        </Paragraph>
                    </ThemedView>
                    <Paragraph>
                        You have the right to request information as to whether the personal data concerning you is being transmitted to a third country or to an international organization. In this
                        context, you can request to be informed about the appropriate guarantees in accordance with Art. 46 GDPR in connection with the transmission.
                    </Paragraph>
                    <HThree>6.2. Right to rectification</HThree>
                    <Paragraph>
                        You have the right to request the person responsible to correct and / or complete the personal data concerning you immediately if the personal data concerning you is incorrect
                        or incomplete.
                    </Paragraph>
                    <HThree>6.3. Right to restriction of processing</HThree>
                    <Paragraph>Under the following conditions, you can request the restriction of the processing of the personal data concerning you:</Paragraph>
                    <Paragraph>
                        <Li>if you dispute the accuracy of the personal data concerning you for a period that enables the person responsible to check the accuracy of the personal data</Li>
                        <Li>the processing is unlawful and you refuse to delete the personal data and instead request that the use of the personal data be restricted</Li>
                        <Li>the person responsible no longer needs the personal data for the purposes of processing, but you need them to assert, exercise or defend legal claims, or</Li>
                        <Li>
                            if you have objected to the processing in accordance with Art. 21 (1) GDPR and it is not yet certain whether the legitimate reasons of the person responsible outweigh your
                            reasons.
                        </Li>
                    </Paragraph>
                    <Paragraph>
                        If the processing of the personal data concerning you has been restricted, this data – apart from its storage – may only be processed with your consent or for the purpose of
                        asserting, exercising or defending legal claims or protecting the rights of another natural or legal person or for reasons of important public interest Union or a Member State.
                    </Paragraph>
                </Paragraph>
                <HThree>6.4. Right to erasure</HThree>
                <ThemedView ghost>
                    <Paragraph>
                        a) Obligation to delete
                        <NewLine numberOfLines={1} />
                        You can request the person responsible to delete the personal data concerning you immediately, and the person responsible is obliged to delete this data immediately if one of
                        the following reasons applies:
                    </Paragraph>
                    <Paragraph>The personal data concerning you are no longer necessary for the purposes for which they were collected or otherwise processed.</Paragraph>
                    <Paragraph>
                        You revoke your consent on which the processing was based in accordance with Art. 6 Para. 1 lit. a or Art. 9 Para. 2 lit. a GDPR, and there is no other legal basis for the
                        processing.
                    </Paragraph>
                    <Paragraph>
                        You object to the processing in accordance with Art. 21 (1) GDPR and there are no overriding legitimate reasons for the processing, or you object to the processing in
                        accordance with Art. 21 (2) GDPR.
                    </Paragraph>
                    <Paragraph>The personal data concerning you has been processed unlawfully.</Paragraph>
                    <Paragraph>
                        The deletion of the personal data concerning you is necessary to fulfill a legal obligation under Union law or the law of the member states to which the person responsible is
                        subject.
                    </Paragraph>
                    <Paragraph>The personal data concerning you was collected in relation to information society services offered in accordance with Art. 8 (1) GDPR.</Paragraph>
                    <Paragraph>
                        b) Information to third parties
                        <NewLine numberOfLines={1} />
                        If the person responsible has made the personal data concerning you public and is obliged to delete it in accordance with Art. 17 (1) GDPR, he takes appropriate measures,
                        including technical measures, taking into account the available technology and the implementation costs, to inform those responsible for data processing who process the
                        personal data that you as the data subject have requested the deletion of all links to this personal data or of copies or replications of this personal data.
                    </Paragraph>
                    <Paragraph>
                        c) Exceptions
                        <NewLine numberOfLines={1} />
                        <Paragraph>The right to deletion does not exist if the processing is necessary:</Paragraph>
                        <Li>to exercise the right to freedom of expression and information;</Li>
                        <Li>
                            to fulfill a legal obligation that requires processing under the law of the Union or of the member states to which the person responsible is subject, or to perform a task
                            that is in the public interest or in the exercise of official authority that has been transferred to the person responsible;
                        </Li>
                        <Li>for reasons of public interest in the area of public health in accordance with Art. 9 (2) lit. h and i and Art. 9 (3) GDPR;</Li>
                        <Li>
                            for archiving purposes in the public interest, scientific or historical research purposes or for statistical purposes in accordance with Art. 89 (1) GDPR, insofar as the
                            right mentioned under section a) is likely to make the realization of the goals of this processing impossible or seriously impair it, or
                        </Li>
                        <Li>to assert, exercise or defend legal claims.</Li>
                    </Paragraph>
                    <HThree>6.5. Right to information</HThree>
                    <Paragraph>
                        If you have exercised your right to correction, deletion or restriction of processing against the person responsible, he is obliged to inform all recipients to whom the
                        personal data concerning you have been disclosed of this correction or deletion of the data or restriction of processing, unless this proves to be impossible or involves a
                        disproportionate effort. You have the right to be informed about these recipients by the person responsible.
                    </Paragraph>
                    <HThree>6.6. Right to data portability</HThree>
                    <ThemedView ghost>
                        <Paragraph>
                            You have the right to receive the personal data concerning you that you have provided to the person responsible in a structured, common and machine-readable format. You
                            also have the right to transfer this data to another person responsible without hindrance from the person responsible to whom the personal data was provided, provided that
                        </Paragraph>
                        <Li>
                            the processing is based on consent in accordance with Art. 6 Para. 1 lit. a GDPR or Art. 9 Para. 2 lit. a GDPR or on a contract in accordance with Art. 6 Para. 1 lit. b
                            GDPR and
                        </Li>

                        <Li>the processing is carried out using automated procedures.</Li>
                    </ThemedView>
                    <Paragraph>
                        In exercising this right, you also have the right to have the personal data concerning you transmitted directly from one person responsible to another, insofar as this is
                        technically feasible. The freedoms and rights of other people must not be affected by this.
                    </Paragraph>
                    <Paragraph>
                        The right to data portability does not apply to the processing of personal data necessary for the performance of a task that is in the public interest or in the exercise of
                        official authority that has been transferred to the person responsible.
                    </Paragraph>
                    <HThree>6.7. Right to object</HThree>
                    <Paragraph>
                        You have the right, for reasons that arise from your particular situation, to object at any time to the processing of the personal data concerning you, which is based on
                        Article 6 (1) lit. e or f GDPR, to object; this also applies to profiling based on these provisions. The person responsible will no longer process the personal data concerning
                        you unless he can demonstrate compelling legitimate reasons for the processing that outweigh your interests, rights and freedoms, or the processing serves to assert, exercise
                        or defend legal claims. If the personal data concerning you is processed for direct marketing purposes, you have the right to object at any time to the processing of the
                        personal data concerning you for the purpose of such advertising; this also applies to profiling insofar as it is connected to such direct advertising. If you object to the
                        processing for direct marketing purposes, the personal data concerning you will no longer be processed for these purposes. In connection with the use of information society
                        services, you can exercise your right to object using automated procedures that use technical specifications.
                    </Paragraph>
                    <HThree>6.8. Right to revoke the data protection declaration of consent</HThree>
                    <ThemedView ghost>
                        <Paragraph>
                            You have the right to revoke your data protection declaration of consent at any time. By revoking the consent, the legality of the processing carried out on the basis of
                            the consent until the revocation is not affected.
                        </Paragraph>
                        <HThree>6.9. Automated decision in individual cases including profiling</HThree>
                        <Paragraph>
                            You have the right not to be subject to a decision based solely on automated processing — including profiling — which has legal effects on you or similarly significantly
                            affects you. This does not apply if the decision
                        </Paragraph>
                        <Li>is necessary for the conclusion or performance of a contract between you and the person responsible,</Li>
                        <Li>
                            is permissible on the basis of legal provisions of the Union or of the member states to which the person responsible is subject and these legal provisions contain
                            appropriate measures to safeguard your rights and freedoms as well as your legitimate interests or
                        </Li>
                        <Li>is made with your express consent.</Li>
                    </ThemedView>
                    <Paragraph>
                        However, these decisions may not be based on special categories of personal data according to Art. 9 Para. 1 GDPR, unless Art. 9 Para. 2 lit. a or g GDPR applies and
                        appropriate measures have been taken to protect your rights and freedoms as well as your legitimate interests. In the cases mentioned in paragraph 1, the person responsible
                        takes appropriate measures to safeguard your rights and freedoms as well as your legitimate interests, including at least the right to obtain the intervention of a person on
                        the part of the person responsible, to state your own position and to challenge the decision.
                    </Paragraph>
                    <HThree>6.10. Right to lodge a complaint with a supervisory authority</HThree>
                    <Paragraph>
                        Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint with a supervisory authority, in particular in the member state of
                        your residence, your place of work or the place of the alleged violation, if you are of the opinion that the processing of the personal data concerning you violates the GDPR.
                        The supervisory authority to which the complaint was submitted informs the complainant about the status and the results of the complaint, including the possibility of a
                        judicial remedy in accordance with Art. 78 GDPR.
                    </Paragraph>
                    <HTwo>7. Change of the data protection declaration</HTwo>
                    <Paragraph>
                        We reserve the right to change or adapt this data protection declaration at any time in compliance with the applicable data protection regulations. The last change to this data
                        protection regulation was made on February 12, 2021.
                    </Paragraph>
                </ThemedView>
            </ThemedView>
        ),
        [],
    );
    const DeutscherDatenschutz = useCallback(
        () => (
            <ThemedView ghost>
                <HTwo>1. Verantwortlicher</HTwo>
                <Paragraph>
                    Der Verantwortliche im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher
                    Bestimmungen ist:
                </Paragraph>
                <Paragraph>
                    <ThemedView ghost>
                        <ThemedView ghost>
                            <Text ghost>Florian Erwerth</Text>
                        </ThemedView>
                        <ThemedView ghost>
                            <Text ghost>Balanstraße 93</Text>
                        </ThemedView>
                        <ThemedView ghost>
                            <Text ghost>81539 München</Text>
                        </ThemedView>
                        <ThemedView ghost>
                            <Text ghost> Deutschland</Text>
                        </ThemedView>
                        <ThemedView ghost>
                            <Text ghost>Tel.: +49 157 30243460</Text>
                        </ThemedView>
                        <ThemedView ghost>
                            <Text ghost>E‑Mail: pureweight.app@gmail.com</Text>
                        </ThemedView>
                        <ThemedView ghost>
                            <Text ghost>Website: https://pureweight.info</Text>
                        </ThemedView>
                    </ThemedView>
                </Paragraph>
                <Paragraph>
                    <HTwo>2. Allgemeines</HTwo>
                    <HThree>2.1 Umfang der Verarbeitung von personenbezogenen daten</HThree>
                    <Paragraph>Wir verarbeiten keine personenbezogenen Daten unserer Nutzer in Pure Weight.</Paragraph>
                    <HThree>2.2. Rechtsgrundlage für die Verarbeitung personenbezogener</HThree>
                    <ThemedView ghost>
                        <Paragraph>Auch wenn Pure Weight keine Daten verarbeitet sind wir verpflichtet die Rechtsgrundlage für die Verarbeitung personenbezogener Daten anzugeben.</Paragraph>
                        <Paragraph>
                            Daten Sofern die Rechtsgrundlage in unserer Datenschutzerklärung nicht genannt wird, beruht die Verarbeitung von personenbezogenen Daten auf folgenden Rechtsgrundlagen:
                            Soweit wir für Verarbeitungsvorgänge personenbezogener Daten deine Einwilligung einholen, dient Art. 6 Abs. 1 lit. a EU-Datenschutzgrundverordnung (DSGVO) als
                            Rechtsgrundlage. Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages, dessen Vertragspartei du bist, erforderlich ist, dient Art. 6 Abs. 1
                            lit. b DSGVO als Rechtsgrundlage. Dies gilt auch für Verarbeitungsvorgänge, die zur Durchführung vorvertraglicher Maßnahmen erforderlich sind. Soweit eine Verarbeitung
                            personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, der unser Unternehmen unterliegt, dient Art. 6 Abs. 1 lit. c DSGVO als
                            Rechtsgrundlage. Für den Fall, dass lebenswichtige Interessen von dir oder einer anderen natürlichen Person eine Verarbeitung personenbezogener Daten erforderlich machen,
                            dient Art. 6 Abs. 1 lit. d DSGVO als Rechtsgrundlage. Ist die Verarbeitung zur Wahrung eines berechtigten Interesses unseres Unternehmens oder eines Dritten erforderlich
                            und überwiegen deine Interessen, Grundrechte und Grundfreiheiten das erstgenannte Interesse nicht, so dient Art. 6 Abs. 1 lit. f DSGVO als Rechtsgrundlage für die
                            Verarbeitung.
                        </Paragraph>
                    </ThemedView>
                    <HThree>2.3. Datenlöschung und Speicherdauer</HThree>
                    <Paragraph>Da keine Daten verarbeitet werden, gibt es auch keine Speicherdauer oder Löschung von Daten.</Paragraph>
                    <HTwo>3. Daten, die du selbst in der App eingibst</HTwo>
                    <HThree>3.1. Beschreibung und Umfang der Datenverarbeitung</HThree>
                    <ThemedView ghost>
                        <Paragraph>Um mit Pure Weight Workouts tracken zu können müssen folgende Daten im Endgerät gespeichert werden:</Paragraph>
                        <ThemedView ghost>
                            <Li>Namen von Workouts</Li>
                            <Li>Namen von Übungen</Li>
                            <Li>Anzahl von Wiederholungen</Li>
                            <Li>Anzahl von Sätzen</Li>
                            <Li>Gewicht von Übungen</Li>
                            <Li>Notizen</Li>
                        </ThemedView>
                        <Paragraph>Diese Daten werden dann auch verwendet, um Trainingsfortschritte zu präsentieren.</Paragraph>
                    </ThemedView>
                    <HThree>3.2. Rechtsgrundlage für die Datenverarbeitung</HThree>
                    <Paragraph>
                        Die Rechtsgrundlage für die Verarbeitung der personenbezogenen Daten, die du selbst in der App eingibst, ist Art. 6 Abs. 1 lit. b DSGVO, da die Erhebung dieser Daten im Rahmen
                        der Erfüllung eines Vertrages, dessen Vertragspartei der Nutzer ist oder der Durchführung vorvertraglicher Maßnahmen dient.
                    </Paragraph>
                    <HThree>3.3. Zweck der Datenverarbeitung</HThree>
                    <Paragraph>Wir speichern Daten, die du selbst in Pure Weight eingibst auf dem Endgerät, um:</Paragraph>
                    <ThemedView ghost>
                        <Li>den Trainingsfortschritt anzuzeigen</Li>
                        <Li>das Trainingsdatum und die Dauer anzuzeigen</Li>
                        <Li>eine Zusammenfassung des vorher abgeschlossenen Trainings anzeigen zu können</Li>
                        <Li>den Messfortschritt anzuzeigen</Li>
                    </ThemedView>
                    <HThree>3.4. Dauer der Speicherung</HThree>
                    <Paragraph>Alle Daten werden gelöscht, sobald Pure Weight deinstalliert wurde.</Paragraph>
                    <HThree>3.5 Widerspruchs- und Beseitigungsmöglichkeit</HThree>
                    <Paragraph>
                        Da alle Daten auf dem Endgerät verbleiben hat der Nutzer zu jederzeit die volle Kontrolle über die in Punkt 3.1 und Punkt 3.2 erwähnten Daten. Eine Widerspruchs- oder
                        Beseitigungsmöglichkeit ist daher nicht notwendig.
                    </Paragraph>
                    <HTwo>4. Begründung eines Vertragsverhältnisses</HTwo>
                    <HThree>4.1. Beschreibung und Umfang der Datenverarbeitung</HThree>
                    <Paragraph>
                        Das Abonement wird über den von Apple betriebenen App Store abgeschlossen. Dort werden die relevanten Daten wie deine z.B. deine Apple ID, Kaufdatum, Anfangs- und Enddatum oder
                        deine Zahlungsinformationen verarbeitet und gespeichert, um die Zahlung und die Nutzung des Abonements zu ermöglichen. Für die Übermittlung der Abonnement-Abschlüsse nutzen wir
                        den Dienst RevenueCat (RevenueCat, Inc. 633 Tarava St. Suite 101, San Francisco, CA 94116, USA).
                    </Paragraph>
                    <Paragraph>
                        Die Datenschutzerklärung von Apple ist hier zu finden: https://www.apple.com/de/privacy <NewLine numberOfLines={1} />
                        Die Datenschutzerklärung von RevenueCat ist hier zu finden: https://www.revenuecat.com/privacy
                    </Paragraph>
                    <HThree>4.2. Rechtsgrundlage für die Datenverarbeitung</HThree>
                    <Paragraph>
                        Die Rechtsgrundlage für die Verarbeitung der personenbezogenen Daten ist Art. 6 Abs. 1 lit. b DSGVO, da die Erhebung dieser Daten im Rahmen der Erfüllung eines Vertrages,
                        dessen Vertragspartei der Nutzer ist oder der Durchführung vorvertraglicher Maßnahmen dient.
                    </Paragraph>
                    <HThree>4.3. Zweck der Datenverarbeitung</HThree>
                    <Paragraph>Die Verarbeitung der personenbezogenen Daten dient der Abwicklung des Abonements und der Zahlung.</Paragraph>
                    <HThree>4.4. Dauer der Speicherung</HThree>
                    <Paragraph>
                        Die Dauer der Datenspeicherung findest Du in der Datenschutzerklärung von Apple bzw. in der Datenschutzerklärung von RevenueCat. Die Datenschutzerklärung von Apple ist hier zu
                        finden: https://www.apple.com/de/privacy Die Datenschutzerklärung von RevenueCat ist hier zu finden: https://www.revenuecat.com/privacy
                    </Paragraph>
                    <HThree>4.5 Widerspruchs- und Beseitigungsmöglichkeit</HThree>
                    <Paragraph>
                        Da die Daten von Apple verarbeitet werden, ist die Widerspruchs- und Beseitigungsmöglichkeit in der Datenschutzerklärung von Apple zu finden.
                        (https://www.apple.com/de/privacy).
                    </Paragraph>
                    <HTwo>5. Google Fonts</HTwo>
                    <Paragraph>
                        Unsere Website benutzt Google Fonts Schriftarten (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA). Die Datenschutzerklärung des Anbieters ist hier zu
                        finden: https://www.google.com/policies/privacy
                    </Paragraph>
                    <HTwo>6. Deine Rechte</HTwo>
                    <HThree>6.1 Auskunftsrecht</HThree>
                    <Paragraph>Du kannst von dem Verantwortlichen eine Bestätigung darüber verlangen, ob personenbezogene Daten, die dich betreffen, von uns verarbeitet werden.</Paragraph>
                    <Paragraph>Liegt eine solche Verarbeitung vor, kannst du von dem Verantwortlichen über folgende Informationen Auskunft verlangen:</Paragraph>
                    <ThemedView ghost>
                        <Li>die Zwecke, zu denen die personenbezogenen Daten verarbeitet werden</Li>
                        <Li>die Kategorien von personenbezogenen Daten, welche verarbeitet werden</Li>
                        <Li>die Empfänger bzw. die Kategorien von Empfängern, gegenüber denen die dich betreffenden personenbezogenen Daten offengelegt wurden oder noch offengelegt werden</Li>
                        <Li>
                            die geplante Dauer der Speicherung der dich betreffenden personenbezogenen Daten oder, falls konkrete Angaben hierzu nicht möglich sind, Kriterien für die Festlegung der
                            Speicherdauer
                        </Li>
                        <Li>
                            das Bestehen eines Rechts auf Berichtigung oder Löschung der dich betreffenden personenbezogenen Daten, eines Rechts auf Einschränkung der Verarbeitung durch den
                            Verantwortlichen oder eines Widerspruchsrechts gegen diese Verarbeitung
                        </Li>
                        <Li>das Bestehen eines Beschwerderechts bei einer Aufsichtsbehörde</Li>
                        <Li>alle verfügbaren Informationen über die Herkunft der Daten, wenn die personenbezogenen Daten nicht bei dir erhoben werden</Li>
                        <Li>
                            das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling gemäß Art. 22 Abs. 1 und 4 DSGVO und – zumindest in diesen Fällen – aussagekräftige
                            Informationen über die involvierte Logik sowie die Tragweite und die angestrebten Auswirkungen einer derartigen Verarbeitung für dich.
                        </Li>
                    </ThemedView>
                    <Paragraph>
                        Dir steht das Recht zu, Auskunft darüber zu verlangen, ob die dich betreffenden personenbezogenen Daten in ein Drittland oder an eine internationale Organisation übermittelt
                        werden. In diesem Zusammenhang kannst du verlangen, über die geeigneten Garantien gem. Art. 46 DSGVO im Zusammenhang mit der Übermittlung unterrichtet zu werden.
                    </Paragraph>
                    <HThree>6.2. Recht auf Berichtigung</HThree>
                    <Paragraph>
                        Du hast ein Recht auf Berichtigung und/oder Vervollständigung gegenüber dem Verantwortlichen, sofern die verarbeiteten personenbezogenen Daten, die dich betreffen, unrichtig
                        oder unvollständig sind. Der Verantwortliche hat die Berichtigung unverzüglich vorzunehmen.
                    </Paragraph>
                    <HThree>6.3. Recht auf Einschränkung der Verarbeitung</HThree>
                    <Paragraph>Unter den folgenden Voraussetzungen kannst du die Einschränkung der Verarbeitung der dich betreffenden personenbezogenen Daten verlangen:</Paragraph>
                    <ThemedView ghost>
                        <Li>
                            wenn du die Richtigkeit der dich betreffenden personenbezogenen für eine Dauer bestreitest, die es dem Verantwortlichen ermöglicht, die Richtigkeit der personenbezogenen
                            Daten zu überprüfen
                        </Li>
                        <Li>
                            die Verarbeitung unrechtmäßig ist und du die Löschung der personenbezogenen Daten ablehnst und stattdessen die Einschränkung der Nutzung der personenbezogenen Daten
                            verlangst
                        </Li>
                        <Li>
                            der Verantwortliche die personenbezogenen Daten für die Zwecke der Verarbeitung nicht länger benötigt, du sie jedoch zur Geltendmachung, Ausübung oder Verteidigung von
                            Rechtsansprüchen benötigst, oder
                        </Li>
                        <Li>
                            wenn du Widerspruch gegen die Verarbeitung gemäß Art. 21 Abs. 1 DSGVO eingelegt hast und noch nicht feststeht, ob die berechtigten Gründe des Verantwortlichen gegenüber
                            deinen Gründen überwiegen.
                        </Li>
                    </ThemedView>
                    <Paragraph>
                        Wurde die Verarbeitung der dich betreffenden personenbezogenen Daten eingeschränkt, dürfen diese Daten – von ihrer Speicherung abgesehen – nur mit deiner Einwilligung oder zur
                        Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines wichtigen
                        öffentlichen Interesses der Union oder eines Mitgliedstaats verarbeitet werden.
                    </Paragraph>
                    <HThree>6.4. Recht auf Löschung</HThree>
                    <ThemedView ghost>
                        <Paragraph>a) Löschungspflicht</Paragraph>
                        <Paragraph>
                            Du kannst von dem Verantwortlichen verlangen, dass die dich betreffenden personenbezogenen Daten unverzüglich gelöscht werden, und der Verantwortliche ist verpflichtet,
                            diese Daten unverzüglich zu löschen, sofern einer der folgenden Gründe zutrifft:
                        </Paragraph>
                        <Li>Die dich betreffenden personenbezogenen Daten sind für die Zwecke, für die sie erhoben oder auf sonstige Weise verarbeitet wurden, nicht mehr notwendig.</Li>
                        <Li>
                            Du widerrufst deine Einwilligung, auf die sich die Verarbeitung gem. Art. 6 Abs. 1 lit. a oder Art. 9 Abs. 2 lit. a DSGVO stützte, und es fehlt an einer anderweitigen
                            Rechtsgrundlage für die Verarbeitung.
                        </Li>
                        <Li>
                            Du legst gem. Art. 21 Abs. 1 DSGVO Widerspruch gegen die Verarbeitung ein und es liegen keine vorrangigen berechtigten Gründe für die Verarbeitung vor, oder du legst gem.
                            Art. 21 Abs. 2 DSGVO Widerspruch gegen die Verarbeitung ein.
                        </Li>
                        <Li>Die dich betreffenden personenbezogenen Daten wurden unrechtmäßig verarbeitet.</Li>
                        <Li>
                            Die Löschung der dich betreffenden personenbezogenen Daten ist zur Erfüllung einer rechtlichen Verpflichtung nach dem Unionsrecht oder dem Recht der Mitgliedstaaten
                            erforderlich, dem der Verantwortliche unterliegt.
                        </Li>
                        <Li>Die dich betreffenden personenbezogenen Daten wurden in Bezug auf angebotene Dienste der Informationsgesellschaft gemäß Art. 8 Abs. 1 DSGVO erhoben.</Li>
                        <Paragraph>b) Information an Dritte</Paragraph>
                        <Paragraph>
                            Hat der Verantwortliche die dich betreffenden personenbezogenen Daten öffentlich gemacht und ist er gem. Art. 17 Abs. 1 DSGVO zu deren Löschung verpflichtet, so trifft er
                            unter Berücksichtigung der verfügbaren Technologie und der Implementierungskosten angemessene Maßnahmen, auch technischer Art, um für die Datenverarbeitung Verantwortliche,
                            die die personenbezogenen Daten verarbeiten, darüber zu informieren, dass du als betroffene Person von ihnen die Löschung aller Links zu diesen personenbezogenen Daten oder
                            von Kopien oder Replikationen dieser personenbezogenen Daten verlangt hast.
                        </Paragraph>
                        <Paragraph>c) Ausnahmen</Paragraph>
                        <Paragraph>Das Recht auf Löschung besteht nicht, soweit die Verarbeitung erforderlich ist:</Paragraph>
                        <Li>zur Ausübung des Rechts auf freie Meinungsäußerung und Information;</Li>
                        <Li>
                            zur Erfüllung einer rechtlichen Verpflichtung, die die Verarbeitung nach dem Recht der Union oder der Mitgliedstaaten, dem der Verantwortliche unterliegt, erfordert, oder
                            zur Wahrnehmung einer Aufgabe, die im öffentlichen Interesse liegt oder in Ausübung öffentlicher Gewalt erfolgt, die dem Verantwortlichen übertragen wurde;
                        </Li>
                        <Li>aus Gründen des öffentlichen Interesses im Bereich der öffentlichen Gesundheit gemäß Art. 9 Abs. 2 lit. h und i sowie Art. 9 Abs. 3 DSGVO;</Li>
                        <Li>
                            für im öffentlichen Interesse liegende Archivzwecke, wissenschaftliche oder historische Forschungszwecke oder für statistische Zwecke gem. Art. 89 Abs. 1 DSGVO, soweit das
                            unter Abschnitt a) genannte Recht voraussichtlich die Verwirklichung der Ziele dieser Verarbeitung unmöglich macht oder ernsthaft beeinträchtigt, oder
                        </Li>
                        <Li>zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.</Li>
                        <HThree>6.5. Recht auf Unterrichtung</HThree>
                        <Paragraph>
                            Haben Sie das Recht auf Berichtigung, Löschung oder Einschränkung der Verarbeitung gegenüber dem Verantwortlichen geltend gemacht, ist dieser verpflichtet, allen
                            Empfängern, denen die dich betreffenden personenbezogenen Daten offengelegt wurden, diese Berichtigung oder Löschung der Daten oder Einschränkung der Verarbeitung
                            mitzuteilen, es sei denn, dies erweist sich als unmöglich oder ist mit einem unverhältnismäßigen Aufwand verbunden. Ihnen steht gegenüber dem Verantwortlichen das Recht zu,
                            über diese Empfänger unterrichtet zu werden.
                        </Paragraph>
                        <HThree>6.6. Recht auf Datenübertragbarkeit</HThree>
                        <Paragraph>
                            Du hast das Recht, die dich betreffenden personenbezogenen Daten, die du dem Verantwortlichen bereitgestellt hast, in einem strukturierten, gängigen und maschinenlesbaren
                            Format zu erhalten. Außerdem hast du das Recht, diese Daten einem anderen Verantwortlichen ohne Behinderung durch den Verantwortlichen, dem die personenbezogenen Daten
                            bereitgestellt wurden, zu übermitteln, sofern
                            <Li>
                                die Verarbeitung auf einer Einwilligung gem. Art. 6 Abs. 1 lit. a DSGVO oder Art. 9 Abs. 2 lit. a DSGVO oder auf einem Vertrag gem. Art. 6 Abs. 1 lit. b DSGVO beruht
                                und
                            </Li>
                            <Li>die Verarbeitung mithilfe automatisierter Verfahren erfolgt.</Li>
                        </Paragraph>
                        <Paragraph>
                            In Ausübung dieses Rechts hast du ferner das Recht, zu erwirken, dass die dich betreffenden personenbezogenen Daten direkt von einem Verantwortlichen einem anderen
                            Verantwortlichen übermittelt werden, soweit dies technisch machbar ist. Freiheiten und Rechte anderer Personen dürfen hierdurch nicht beeinträchtigt werden.
                        </Paragraph>
                        <Paragraph>
                            Das Recht auf Datenübertragbarkeit gilt nicht für eine Verarbeitung personenbezogener Daten, die für die Wahrnehmung einer Aufgabe erforderlich ist, die im öffentlichen
                            Interesse liegt oder in Ausübung öffentlicher Gewalt erfolgt, die dem Verantwortlichen übertragen wurde.
                        </Paragraph>
                        <HThree>6.7. Widerspruchsrecht</HThree>
                        <Paragraph>
                            Du hast das Recht, aus Gründen, die sich aus deiner besonderen Situation ergeben, jederzeit gegen die Verarbeitung der dich betreffenden personenbezogenen Daten, die
                            aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzule gen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Der Verantwortliche
                            verarbeitet die dich betreffenden personenbezogenen Daten nicht mehr, es sei denn, er kann zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die deine
                            Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen. Werden die dich betreffenden
                            personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, hast du das Recht, jederzeit Widerspruch gegen die Verarbeitung der dich betreffenden personenbezogenen
                            Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht. Widersprichst du der Verarbeitung
                            für Zwecke der Direktwerbung, so werden die dich betreffenden personenbezogenen Daten nicht mehr für diese Zwecke verarbeitet. Im Zusammenhang mit der Nutzung von Diensten
                            der Informationsgesellschaft kannst du ungeachtet der Richtlinie 2002/58/EG dein Widerspruchsrecht mittels automatisierter Verfahren ausüben, bei denen technische
                            Spezifikationen verwendet werden.
                        </Paragraph>
                        <HThree>6.8. Recht auf Widerruf der datenschutzrechtlichen Einwilligungserklärung</HThree>
                        <Paragraph>
                            Du hast das Recht, deine datenschutzrechtliche Einwilligungserklärung jederzeit zu widerrufen. Durch den Widerruf der Einwilligung wird die Rechtmäßigkeit der aufgrund der
                            Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.
                            <HThree>6.9. Automatisierte Entscheidung im Einzelfall einschließlich Profiling</HThree>
                            Du hast das Recht, nicht einer ausschließlich auf einer automatisierten Verarbeitung — einschließlich Profiling — beruhenden Entscheidung unterworfen zu werden, die dir
                            gegenüber rechtliche Wirkung entfaltet oder dich in ähnlicher Weise erheblich beeinträchtigt. Dies gilt nicht, wenn die Entscheidung
                            <Li>für den Abschluss oder die Erfüllung eines Vertrags zwischen dir und dem Verantwortlichen erforderlich ist,</Li>
                            <Li>
                                aufgrund von Rechtsvorschriften der Union oder der Mitgliedstaaten, denen der Verantwortliche unterliegt, zulässig ist und diese Rechtsvorschriften angemessene
                                Maßnahmen zur Wahrung deiner Rechte und Freiheiten sowie deiner berechtigten Interessen enthalten oder
                            </Li>
                            <Li>mit deiner ausdrücklichen Einwilligung erfolgt.</Li>
                        </Paragraph>
                        <Paragraph>
                            Allerdings dürfen diese Entscheidungen nicht auf besonderen Kategorien personenbezogener Daten nach Art. 9 Abs. 1 DSGVO beruhen, sofern nicht Art. 9 Abs. 2 lit. a oder g
                            DSGVO gilt und angemessene Maßnahmen zum Schutz der Rechte und Freiheiten sowie deiner berechtigten Interessen getroffen wurden. In den in Absatz 1 genannten Fällen trifft
                            der Verantwortliche angemessene Maßnahmen, um die Rechte und Freiheiten sowie deine berechtigten Interessen zu wahren, wozu mindestens das Recht auf Erwirkung des
                            Eingreifens einer Person seitens des Verantwortlichen, auf Darlegung des eigenen Standpunkts und auf Anfechtung der Entscheidung gehört.
                        </Paragraph>
                        <HThree>6.10. Recht auf Beschwerde bei einer Aufsichtsbehörde</HThree>
                        <Paragraph>
                            Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht dir das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem
                            Mitgliedstaat deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, zu, wenn du der Ansicht bist, dass die Verarbeitung der dich
                            betreffenden personenbezogenen Daten gegen die DSGVO verstößt. Die Aufsichtsbehörde, bei der die Beschwerde eingereicht wurde, unterrichtet den Beschwerdeführer über den
                            Stand und die Ergebnisse der Beschwerde einschließlich der Möglichkeit eines gerichtlichen Rechtsbehelfs nach Art. 78 DSGVO.
                        </Paragraph>
                        <HTwo>7. Änderung der Datenschutzbestimmung</HTwo>
                        <Paragraph>
                            Wir behalten uns das Recht vor, diese Datenschutzerklärung jederzeit unter Beachtung der geltenden Datenschutzvorschriften zu ändern bzw. anzupassen. Die letzte Änderung
                            dieser Datenschutzbestimmung erfolgte am 12. Februar, 2021.
                        </Paragraph>
                    </ThemedView>
                </Paragraph>
            </ThemedView>
        ),
        [],
    );

    return (
        <ThemedBottomSheetModal title={t(TranslationKeys.PRIVACY)} ref={reference}>
            <PageContent ghost>{language === "de" ? DeutscherDatenschutz() : EnglischDatenschutz()}</PageContent>
        </ThemedBottomSheetModal>
    );
};
