import { HThree, HTwo, Li, Paragraph } from "../HTML";
import { ThemedView } from "../Themed/ThemedView/View";
import { RefObject, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { useAppSelector } from "../../store";
import { getLanguage } from "../../store/selectors/settings/settingsSelectors";
import { Text } from "../Themed/ThemedText/Text";
import { PageContent } from "../PageContent/PageContent";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

type AGBProps = {
    reference: RefObject<BottomSheetModal>;
};
export const AGB = ({ reference }: AGBProps) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTypedTranslation();
    const EnglischAGB = useCallback(
        () => (
            <ThemedView ghost>
                <HTwo>1. General</HTwo>
                <HThree>1.1. Scope and subject matter of the contract</HThree>
                <Paragraph>These General Terms and Conditions (hereinafter: GTC) establish the legal framework for the use of the Pure Weight app, unless otherwise agreed.</Paragraph>
                <Paragraph>The Pure Weight app (hereinafter: app) is Link strength training app that allows you to record and evaluate your training.</Paragraph>
                <HThree>1.2. Contracting party</HThree>
                <Paragraph>The provider of the app is:</Paragraph>
                <Paragraph>
                    <ThemedView ghost>
                        <Text ghost>Florian Erwerth</Text>
                        <Text ghost>Balanstraße 93</Text>
                        <Text ghost>81539 München</Text>
                        <Text ghost>Deutschland</Text>
                        <Text ghost>E‑Mail: pureweight.app@gmail.com</Text>
                    </ThemedView>
                </Paragraph>
                <HTwo>2. Services</HTwo>
                <HThree>2.1. Paid services</HThree>
                <Paragraph>The app is fully available to all users, if the required subscription has been concluded in the App Store.</Paragraph>
                <Paragraph>
                    The exact scope of services of the app can be found in the app description in the Apple App Store (hereinafter: App Store) in the version valid at the time of conclusion of the
                    contract.
                </Paragraph>
                <HThree>2.2. Changes to the scope of services</HThree>
                <Paragraph>The provider reserves the right to change the scope of services of the app, in particular to expand or limit it.</Paragraph>
                <HTwo>3. Conclusion of the contract</HTwo>
                <HThree>3.1. Downloading the app</HThree>
                <Paragraph>The app must first be downloaded.</Paragraph>
                <HThree>3.2 Subscription</HThree>
                <Paragraph>Link subscription is required for the use of the app. The subscription fee is due in advance for the respective billing period.</Paragraph>
                <Paragraph>There are two subscription models:</Paragraph>
                <Paragraph>
                    <ThemedView ghost>
                        <Li>Monthly subscription</Li>
                        <Li>Annual subscription</Li>
                    </ThemedView>
                </Paragraph>
                <Paragraph>After confirming the subscription in the App Store, the contract is concluded.</Paragraph>
                <Paragraph>
                    Both subscription variants are preceded by Link trial phase. During this trial phase, you can use the app with all features free of charge. The term of your subscription only
                    begins after the trial phase has expired and you have not canceled the subscription via the App Store during this trial phase.
                </Paragraph>
                <Paragraph>
                    The subscription can be canceled at any time. The cancellation must be made via the App Store. The cancellation takes effect at the end of the current billing period. After the end
                    of the billing period, the subscription will not be renewed and the app can no longer be used.
                </Paragraph>
                <HThree>3.3 Buying the app</HThree>
                <Paragraph>The full functionality of the app can also be purchased. After paying the purchase price, the contract is concluded.</Paragraph>
                <Paragraph>You can withdraw from the purchase within 14 days without giving any reason. The cancellation can be made via the App Store.</Paragraph>
                <HTwo>4. Your obligations</HTwo>
                <HThree>4.1. Health requirements</HThree>
                <Paragraph>
                    You use the app at your own risk. Your general state of health should be good. If you have known pre-existing conditions, you should consult Link doctor to see if your physical
                    conditions are suitable for training with the app. This applies especially if you know that you have one or more of the following complaints / interventions / illnesses:
                </Paragraph>
                <Paragraph>
                    <ThemedView ghost>
                        <Li>Joint problems</Li>
                        <Li>operative interventions</Li>
                        <Li>cardiovascular diseases</Li>
                        <Li>diseases of neuromuscular nature</Li>
                        <Li>asthma or other lung or respiratory diseases</Li>
                        <Li>other health restrictions</Li>
                    </ThemedView>
                </Paragraph>
                <Paragraph>As Link woman you should not train with the app if you are pregnant or breastfeeding.</Paragraph>
                <Paragraph>You should only go close to muscle failure under the supervision of Link competent spotter / training partner who can help you in case of doubt.</Paragraph>
                <HThree>4.2. Usage rights</HThree>
                <Paragraph>
                    We have the rights to the content of the app that is protected by copyright or otherwise. You only have Link simple and non-transferable right to use these protected contents
                    privately within the framework of the contractual provisions and you are not allowed to pass on your access data to third parties.
                </Paragraph>
                <HThree>4.3. Behavioral obligations</HThree>
                <Paragraph>You are obliged to refrain from all actions that impair the functionality of the app. This includes, for example, the use of scripts that access the app.</Paragraph>
                <HTwo>5. Usage fees</HTwo>
                <HThree>5.1. Amount of usage fees</HThree>
                <Paragraph>When you conclude Link contract, the current prices at that time apply. An overview of the current prices can be found in the app description of the App Store.</Paragraph>
                <HThree>5.2. Due date of payments</HThree>
                <Paragraph>For Link subscription with Link term of one month, the payment is due in advance at the beginning of the billing month.</Paragraph>
                <Paragraph>For Link subscription with Link term of twelve months, the payment is due in advance at the beginning of the billing year.</Paragraph>
                <Paragraph>The first billing period begins on the day you conclude Link subscription and thus conclude Link contract.</Paragraph>
                <HTwo>6. Right of withdrawal</HTwo>
                <HThree>6.1. Right of withdrawal</HThree>
                <Paragraph>
                    If you conclude Link user contract or Link subscription contract with us, you have the following right of withdrawal. You have the right to withdraw from the contract within
                    fourteen days without giving any reason. The withdrawal period is fourteen days from the day the contract is concluded.
                </Paragraph>
                <Paragraph>To exercise your right of withdrawal, you must cancel your subscription within the fourteen-day period in the App Store.</Paragraph>
                <ThemedView ghost>
                    <Paragraph>In addition, you can also contact the following contact to exercise your right of withdrawal. The revocation must be clearly explained.</Paragraph>
                    <Paragraph>
                        <ThemedView ghost>
                            <Text ghost>Florian Erwerth</Text>
                            <Text ghost>Balanstraße 93</Text>
                            <Text ghost>81539 München</Text>
                            <Text ghost>Deutschland</Text>
                            <Text ghost>E‑Mail: pureweight.app@gmail.com</Text>
                        </ThemedView>
                    </Paragraph>
                </ThemedView>
                <Paragraph>
                    If you make use of this possibility, we will immediately (e.g. by e-mail) send you Link confirmation of the receipt of such Link revocation. To comply with the withdrawal period,
                    it is sufficient that you send the notification of the exercise of the right of withdrawal before the end of the withdrawal period.
                </Paragraph>
                <HThree>6.2. Consequences of withdrawal</HThree>
                <Paragraph>
                    If you withdraw from the contract, we will refund all payments we have received from you, including delivery costs (except for the additional costs resulting from the fact that you
                    have chosen Link different type of delivery than the cheapest standard delivery offered by us), immediately and at the latest within (14) fourteen days from the day on which we
                    receive notification of your withdrawal from the contract. For this repayment, we will use the same means of payment that you used for the original transaction, unless expressly
                    agreed otherwise with you; in no case will you be charged for this repayment.
                </Paragraph>
                <HThree>6.3. Expiry of the right of withdrawal</HThree>
                <Paragraph>
                    Your right of withdrawal expires in the case of Link contract for the delivery of digital content not on Link physical data carrier, even if we have begun to execute the contract
                    after you have expressly agreed that we begin to execute the contract before the end of the withdrawal period and you have confirmed your knowledge that you lose your right of
                    withdrawal by giving your consent to the start of the execution of the contract.
                </Paragraph>
                <HThree>6.4. Sample withdrawal form</HThree>
                <ThemedView ghost>
                    <Paragraph>If you want to withdraw from the contract, please fill out this form and send it back to:</Paragraph>
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
                        - I/we (*) hereby revoke the contract concluded by me/us (*) for the purchase of the following goods (*) /the provision of the following service (*) - Ordered on (*) /received
                        on (*) - Name of the consumer(s) - Address of the consumer(s) - Signature of the consumer(s) (only in the case of communication on paper) Date _______ (*) Delete as applicable.
                    </Paragraph>
                </ThemedView>
                <HTwo>7. Termination of the contract</HTwo>
                <HThree>7.1. Term of the contract and termination</HThree>
                <Paragraph>
                    Your subscription is automatically extended by another month for Link subscription with Link term of one month or by another twelve months for Link subscription with Link term of
                    twelve months, if you do not cancel your subscription in the settings of the App Store at least 24 hours before the end of the contract.
                </Paragraph>
                <Paragraph>
                    After an effective cancellation, your subscription remains in effect until the end of the contract. During this time you can continue to use the app. Afterwards you will be
                    excluded from using the app.
                </Paragraph>
                <Paragraph>We are entitled to terminate your subscription at the end of the term or at the end of the renewal period with Link notice period of two weeks in text form.</Paragraph>
                <HThree>7.3. Termination for good cause</HThree>
                <Paragraph>
                    Both parties have the right to terminate for good cause, which remains unaffected by the above provisions. We reserve the right to terminate your subscription if you are in default
                    of payment.
                </Paragraph>
                <HTwo>8. Data protection</HTwo>
                <Paragraph>
                    When using the app, we do not process any personal data. This privacy policy informs you about the nature and scope of data collection and shows you how we use your data.
                </Paragraph>
                <HTwo>9. Liability</HTwo>
                <HThree>9.1. General</HThree>
                <Paragraph>
                    The app does not provide recommendations regarding the execution of the exercises you have saved. The app is only used to document your training performance. Therefore, we do not
                    accept any liability for damages resulting from the execution of the exercises you have saved.
                </Paragraph>
                <HThree>9.2. Product liability</HThree>
                <Paragraph>Claims under the Product Liability Act remain unaffected by the above limitations or exclusions of liability.</Paragraph>
                <HThree>9.3. No guarantee of achieving your training goals</HThree>
                <Paragraph>
                    We do not guarantee that you will achieve your training goals by using the app. The training result is also influenced by uncontrollable factors such as your genetic
                    predisposition. It can therefore happen that different people achieve different results with the same use of the app.
                </Paragraph>
                <HThree>9.4. Legal provisions for claims due to defective services</HThree>
                <Paragraph>The legal provisions for claims due to defective services apply and your rights as Link consumer remain unaffected in any case.</Paragraph>
                <HTwo>10. Final provisions</HTwo>
                <HThree>10.1. Applicable law</HThree>
                <Paragraph>
                    These GTC and all legal relationships between you and us are subject to the law of the Federal Republic of Germany, excluding the UN Convention on Contracts for the International
                    Sale of Goods (CISG).
                </Paragraph>
                <HThree>10.2. Place of jurisdiction</HThree>
                <Paragraph>
                    If you do not have Link general place of jurisdiction in Germany or in another EU member state or if you have moved your permanent residence to Link country outside the EU after
                    these General Terms and Conditions have become effective or if your place of residence or habitual abode is not known at the time of filing the action, the exclusive place of
                    jurisdiction for all disputes arising from this contract is our place of business.
                </Paragraph>
                <HThree>10.3. Contract language</HThree>
                <Paragraph>The contract language is German.</Paragraph>
                <HThree>10.4. No participation in consumer dispute resolution procedures</HThree>
                <Paragraph>
                    The EU Commission provides Link platform for out-of-court dispute resolution, which gives you the opportunity to settle disputes related to your online order without going to
                    court. You can find the dispute resolution platform here: https://ec.europa.eu/consumers/odr We are neither obliged nor willing to participate in Link dispute resolution procedure
                    before Link consumer arbitration board.
                </Paragraph>
                <HThree>10.5. Changes to our GTC</HThree>
                <Paragraph>
                    We are entitled to change our GTC with effect for the future if the changes are reasonable in consideration of your interests. We will of course inform you in advance about the
                    type and scope of the changes and give you the opportunity to object to these changes within Link reasonable period. We will also inform you that the changes will take effect if
                    you do not object.
                </Paragraph>
            </ThemedView>
        ),
        [],
    );

    const GermanAgb = useCallback(
        () => (
            <>
                <HTwo>1. Allgemeines</HTwo>
                <HThree>1.1. Geltungsbereich und Vertragsgegenstand</HThree>
                <Paragraph>Diese Allgemeinen Geschäftsbedingungen (nachfolgend: AGB) legen den Rechtsrahmen für die Nutzung App Pure Weight fest, soweit nicht etwas anderes vereinbart ist.</Paragraph>
                <Paragraph>Die Pure Weight App (nachfolgend: App) ist eine Krafttrainings-App, die dir erlaubt dein Training aufzuzeichnen und auszuwerten.</Paragraph>
                <HThree>1.2. Vertragspartner</HThree>
                <Paragraph>Anbieter der App ist:</Paragraph>
                <Text ghost>Florian Erwerth</Text>
                <Text ghost>Balanstraße 93</Text>
                <Text ghost>81539 München</Text>
                <Text ghost>Deutschland</Text>
                <Text ghost>Tel.: +49 157 30243460</Text>
                <Text ghost>E‑Mail: pureweight.app@gmail.com</Text>
                <Text ghost>Website: https://pureweight.info</Text>
                <HTwo>2. Leistungen</HTwo>
                <HThree>2.1. Entgeltliche Leistungen</HThree>
                <Paragraph>Die App steht allen Nutzenden im vollen Umfang zur Verfügung, wenn das erforderliche Abonnement im App Store abgeschlossen wurde.</Paragraph>
                <Paragraph>
                    Der genaue Leistungsumfang der App ergibt sich aus der App-Beschreibung im Apple App Store (nachfolgend: App Store) in der zum Zeitpunkt des Vertragsschlusses gültigen Fassung.
                </Paragraph>
                <HThree>2.2. Änderungen des Leistungsumfangs</HThree>
                <Paragraph>Der Anbieter behält sich das Recht vor, den Leistungsumfang der App zu ändern, insbesondere zu erweitern oder zu beschränken.</Paragraph>
                <HTwo>3. Zustandekommen des Vertrages</HTwo>
                <HThree>3.1. Herunterladen der App</HThree>
                <Paragraph>Die App muss zunächst heruntergeladen werden.</Paragraph>
                <HThree>3.2 Abonnement</HThree>
                <Paragraph>Für die Nutzung der App ein Abonnement erforderlich. Die Abonnementgebühr wird im Voraus für den jeweiligen Abrechnungszeitraum fällig.</Paragraph>
                <Paragraph>Es gibt zwei Abo-Modelle:</Paragraph>
                <Paragraph>
                    <Li>Monatliches Abonements</Li>
                    <Li>Jährliches Abonnement</Li>
                </Paragraph>
                <Paragraph>Nach dem Bestätigen des Abonnements im App Store kommt der Vertrag zustande.</Paragraph>
                <Paragraph>
                    Beiden Abonnement-Varianten ist eine Testphase vorgeschaltet. Während dieser Testphase kannst du die App kostenlos im vollem Umfang nutzen. Die Laufzeit deines Abonnements beginnt
                    erst nachdem die Zeit der Testphase verstrichen ist und du das Abonnement während dieser Testphase nicht über den App Store gekündigt hast.
                </Paragraph>
                <Paragraph>
                    Die Kündigung des Abonnements ist jederzeit möglich. Die Kündigung muss über den App Store erfolgen. Die Kündigung wird wirksam zum Ende des laufenden Abrechnungszeitraums. Nach
                    Ablauf des Abrechnungszeitraums wird das Abonnement nicht mehr verlängert und die App kann nicht mehr genutzt werden.
                </Paragraph>
                <HThree>3.3 Kauf der App</HThree>
                <Paragraph>Die volle Funktionsumfang der App kann auch gekauft werden. Nach dem Bezahlen des Kaufbetrags kommt der Vertrag zustande.</Paragraph>
                <Paragraph>Von dem Kauf kann innerhalb von 14 Tagen ohne Angabe von Gründen zurückgetreten werden. Die Kündigung kann über den App Store erfolgen.</Paragraph>
                <HTwo>4. Deine Pflichten</HTwo>
                <HThree>4.1. Gesundheitliche Voraussetzungen</HThree>
                <Paragraph>
                    Du nutzt die App auf eigenes Risiko. Dein allgemeiner Gesundheitszustand sollte gut sein. Bei bekannten Vorerkrankungen, solltest du dich von einem Arzt beraten lassen, ob deine
                    körperlichen Voraussetzungen für das Training mit der App geeignet sind. Das gilt vor allem dann, wenn du weißt, dass du eine oder mehrere der folgenden Beschwerden / Eingriffe /
                    Erkrankungen hast bzw. hattest:
                </Paragraph>
                <Paragraph>
                    <Li>Gelenkprobleme</Li>
                    <Li>operative Eingriffe</Li>
                    <Li>kardiovaskuläre Erkrankungen</Li>
                    <Li>Erkrankungen neuromuskulärer Natur</Li>
                    <Li>Asthma oder andere Lungen- oder Atemwegserkrankungen</Li>
                    <Li>andere gesundheitliche Einschränkungen</Li>
                </Paragraph>
                <Paragraph>Als Frau solltest du nicht mit der App trainieren, wenn du schwanger bist oder stillst.</Paragraph>
                <Paragraph>Du solltest nur unter Aufsicht eines kompetenten Spotters / Trainingspartners, der dir im Zweifel zur Hilfe kommen kann, nah ans Muskelversagen gehen.</Paragraph>
                <HThree>4.2. Nutzungsrechte</HThree>
                <Paragraph>
                    Uns stehen die Rechte der urheberrechtlich oder anderweitig geschützten Inhalte der App zu. Du hast lediglich ein einfaches und nicht-übertragbares Recht, diese geschützten Inhalte
                    privat im Rahmen der Vertragsbestimmungen zu nutzen und darfst deine Zugangsdaten auch nicht an Dritte weitergeben.
                </Paragraph>
                <HThree>4.3. Verhaltenspflichten</HThree>
                <Paragraph>
                    Du bist dazu verpflichtet, alle Handlungen zu unterlassen, die die Funktionsfähigkeit der App beeinträchtigen. Dazu gehört z.B. die Verwendung von Skripten, die auf die App zu
                    greifen.
                </Paragraph>
                <HTwo>5. Nutzungsentgelte</HTwo>
                <HThree>5.1. Höhe der Nutzungsentgelte</HThree>
                <Paragraph>
                    Wenn du einen Vertrag abschließt, gelten die zu diesem Zeitpunkt aktuellen Preise. Eine Übersicht der aktuellen Preise findest du in der App-Beschreibung des App Stores.
                </Paragraph>
                <HThree>5.2. Fälligkeit der Zahlungen</HThree>
                <Paragraph>Bei einem Abonnement mit einer Laufzeit von einem Monat ist die Zahlung jeweils zu Beginn des Abrechnungsmonats sofort im Voraus fällig.</Paragraph>
                <Paragraph>Bei einem Abonnement mit einer Laufzeit von zwölf Monaten ist die Zahlung jeweils zu Beginn des Abrechnungsjahres sofort im Voraus fällig.</Paragraph>
                <Paragraph>Der erste Abrechnungszeitraum beginnt an dem Tag, an dem du ein Abonnement abgeschlossen und somit einen Vertrag geschlossen hast.</Paragraph>
                <HTwo>6. Widerrufsbelehrung</HTwo>
                <HThree>6.1. Widerrufsrecht</HThree>
                <Paragraph>
                    Wenn du mit uns einen Nutzungsvertrag oder einen Vertrag über ein Abonnement abschließt, steht dir jeweils das nachfolgende Widerrufsrecht zu. Du hast das Recht, binnen vierzehn
                    Tagen ohne Angabe von Gründen den Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
                </Paragraph>
                <Paragraph>Um dein Widerrufsrecht auszuüben, musst du dein Abonnement innerhalb der Frist von vierzehn Tagen im App Store kündigen.</Paragraph>
                <Paragraph>
                    <ThemedView ghost>
                        <Paragraph>
                            Zudem kannst Du auch Kontakt mit nachfolgenden Kontakt aufnehmen, um von deinem Widerrufsrecht Gebrauch zu machen. Der Widerruf muss dabei eindeutig erklärt werden.
                        </Paragraph>
                        <Text ghost>Florian Erwerth</Text>
                        <Text ghost>Balanstraße 93</Text>
                        <Text ghost>81539 München</Text>
                        <Text ghost>Deutschland</Text>
                        <Text ghost>E‑Mail: pureweight.app@gmail.com</Text>
                    </ThemedView>
                </Paragraph>
                <Paragraph>
                    Machst du von dieser Möglichkeit Gebrauch, so werden wir dir unverzüglich (z.B. per E‑Mail) eine Bestätigung über den Eingang eines solchen Widerrufs übermitteln. Zur Wahrung der
                    Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
                </Paragraph>
                <HThree>6.2. Folgen des Widerrufs</HThree>
                <Paragraph>
                    Wenn du den Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus
                    ergeben, dass du eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt hast), unverzüglich und spätestens binnen (14) vierzehn Tagen ab dem
                    Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf des Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der
                    ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.
                </Paragraph>
                <HThree>6.3. Erlöschen des Widerrufsrechts</HThree>
                <Paragraph>
                    Dein Widerrufsrecht erlischt bei einem Vertrag über die Lieferung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten auch dann, wenn wir mit der
                    Ausführung des Vertrags begonnen haben, nachdem du ausdrücklich zugestimmt hast, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, und du deine
                    Kenntnis davon bestätigt hast, dass du durch deine Zustimmung mit Beginn der Ausführung des Vertrags dein Widerrufsrecht verlierst.
                </Paragraph>
                <HThree>6.4. Muster-Widerrufsformular</HThree>
                <Paragraph>
                    <ThemedView ghost>
                        <Paragraph>Wenn du den Vertrag widerrufen willst, dann füll bitte dieses Formular aus und sende es zurück an:</Paragraph>
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
                            - Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*) /die Erbringung der folgenden Dienstleistung (*) -
                            Bestellt am (*) /erhalten am (*) - Name des/der Verbraucher(s) - Anschrift des/der Verbraucher(s) - Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
                            Datum _______ (*) Unzutreffendes streichen.
                        </Paragraph>
                    </ThemedView>
                </Paragraph>
                <HTwo>7. Vertragsbeendigung</HTwo>
                <HThree>7.1. Vertragslaufzeit und Kündigung</HThree>
                <Paragraph>
                    Dein Abonnement verlängert sich automatisch um einen weiteren Monat bei einem Abonnement mit einer Laufzeit von einem Monat oder um weiter zwölf Monate bei einem Abonnement mit
                    einer Laufzeit von zwölf Monaten, wenn du dein Abonnement nicht spätestens bis 24 Stunden vor dem Vertragsende in den Einstellungen des App Stores kündigst.
                </Paragraph>
                <Paragraph>
                    Nach einer wirksamen Kündigung bleibt dein Abonnement bis zum Vertragsende bestehen. Während dieser Zeit kannst du die App weiter benutzen. Anschließend wirst Du von der Nutzung
                    der App ausgeschlossen.
                </Paragraph>
                <Paragraph>Wir sind dazu berechtigt, dein Abonnement zum Ende der Laufzeit oder zum Ende des Verlängerungszeitraums mit einer Frist von zwei Wochen in Textform zu kündigen.</Paragraph>
                <HThree>7.3. Kündigung aus wichtigem Grund</HThree>
                <Paragraph>
                    Beide Parteien haben das Recht zur Kündigung aus wichtigem Grund, welches durch die vorstehenden Regelungen unberührt bleibt. Wir behalten uns vor dein Abonnement zu kündigen, wenn
                    Du in Zahlungsverzug bist.
                </Paragraph>
                <HTwo>8. Datenschutz</HTwo>
                <Paragraph>
                    Bei der Nutzung der App verarbeiten keine personenbezogenen Daten. Diese Datenschutzerklärung klärt dich über die Art und den Umfang der Datenerhebung auf und zeigt dir wie wir
                    deine Daten nutzen.
                </Paragraph>
                <HTwo>9. Haftung</HTwo>
                <HThree>9.1. Allgemein</HThree>
                <Paragraph>
                    Von der App werden keine Empfehlungen bezüglich der Ausführung der von Dir gespeicherten Übungen gegeben. Die App dient lediglich der Dokumentation deiner Trainingsleistungen.
                    Daher übernehmen wir keine Haftung für Schäden, die durch die Ausführung der von dir gespeicherten Übungen entstehen.
                </Paragraph>
                <HThree>9.2. Produkthaftung</HThree>
                <Paragraph>Von den vorgenannten Haftungsbeschränkungen oder -ausschlüssen unberührt bleiben Ansprüche nach dem Produkthaftungsgesetz.</Paragraph>
                <HThree>9.3. Keine Garantie für das Erreichen deiner Trainingsziele</HThree>
                <Paragraph>
                    Wir übernehmen keine Garantie dafür, dass du deine Trainingsziele durch Nutzung der App erreichst. Das Trainingsergebnis wird nämlich auch durch nicht steuerbare Faktoren wie z.B.
                    deine genetischen Voraussetzungen beeinflusst. Dementsprechend kann es dazu führen, dass bei gleicher Nutzung der App, verschiedene Personen unterschiedliche Ergebnisse erzielen.
                </Paragraph>
                <HThree>9.4. Gesetzliche Bestimmungen für Ansprüche aufgrund mangelhafter Leistungen</HThree>
                <Paragraph>Es gelten die gesetzlichen Bestimmungen für Ansprüche aufgrund mangelhafter Leistungen und deine Rechte als Verbraucher bleiben in jedem Fall unberührt.</Paragraph>
                <HTwo>10. Schlussbestimmungen</HTwo>
                <HThree>10.1. Anwendbares Recht</HThree>
                <Paragraph>Diese AGB und alle Rechtsbeziehungen zwischen dir und uns unterliegen dem Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).</Paragraph>
                <HThree>10.2. Gerichtsstand</HThree>
                <Paragraph>
                    Hast du keinen allgemeinen Gerichtsstand in Deutschland oder in einem anderen EU-Mitgliedstaat oder hast du deinen festen Wohnsitz nach Wirksamwerden dieser Allgemeinen
                    Geschäftsbedingungen in ein Land außerhalb der EU verlegt oder ist dein Wohnsitz oder gewöhnlicher Aufenthaltsort im Zeitpunkt der Klageerhebung nicht bekannt, ist ausschließlicher
                    Gerichtsstand für sämtliche Streitigkeiten aus diesem Vertrag unser Geschäftssitz.
                </Paragraph>
                <HThree>10.3. Vertragssprache</HThree>
                <Paragraph>Die Vertragssprache ist Deutsch.</Paragraph>
                <HThree>10.4. Keine Teilnahme an Verbraucherstreitbeilegungsverfahren</HThree>
                <Paragraph>
                    Die EU-Kommission stellt eine Plattform für außergerichtliche Streitschlichtungen bereit, die es dir ermöglicht, Streitigkeiten im Zusammenhang mit deiner Online-Bestellung
                    außergerichtlich beizulegen. Hier findest du die Streitbeilegungs-Plattform: https://ec.europa.eu/consumers/odr Wir sind weder verpflichtet noch bereit, vor einer
                    Verbraucherschlichtungsstelle an einem Streitbeilegungsverfahren teilzunehmen.
                </Paragraph>
                <HThree>10.5. Änderungen unserer AGB</HThree>
                <Paragraph>
                    Wir sind dazu berechtigt, unsere AGB mit Wirkung für die Zukunft zu ändern, wenn die Änderungen unter Berücksichtigung deiner Interessen zumutbar sind. Wir werden dich
                    selbstverständlich über die Art und den Umfang der Änderungen vorzeitig in Kenntnis setzen und dir die Möglichkeit geben, diesen Änderungen innerhalb einer angemessenen Frist zu
                    widersprechen. Außerdem werden wir dich darauf hinweisen, dass die Änderungen bei Ausbleiben eines Widerspruchs wirksam werden.
                </Paragraph>
            </>
        ),
        [],
    );

    return (
        <ThemedBottomSheetModal ref={reference} title={t(TranslationKeys.AGB)}>
            <PageContent ghost paddingTop={20}>
                {language === "de" ? GermanAgb() : EnglischAGB()}
            </PageContent>
        </ThemedBottomSheetModal>
    );
};
