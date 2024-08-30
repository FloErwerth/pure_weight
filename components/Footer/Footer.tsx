import { noop } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Linking } from "react-native";
import { useNavigate } from "../../hooks/navigate";
import { useGetRestorePurchase } from "../../hooks/purchases";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";
import { AGB } from "../AGB/AGB";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { Datenschutz } from "../Datenschutz/Datenschutz";
import { PageContent } from "../PageContent/PageContent";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";

type FooterProps = {
	showRestore?: boolean;
};

export const Footer = ({ showRestore }: FooterProps) => {
	const { t } = useTypedTranslation();
	const [restoreResult, setRestoreResult] = useState<"LOADING_RESTORE" | "PENDING" | "SUCCESS" | "FAILED" | undefined>(undefined);
	const { ref: restoreRef, openBottomSheet: openRestoreSheet, closeBottomSheet: closeRestoreSheet } = useBottomSheetRef();
	const { ref: agbRef, openBottomSheet: openAgbSheet } = useBottomSheetRef();
	const { ref: datenschutzRef, openBottomSheet: openDatenschutzSheet } = useBottomSheetRef();
	const restore = useGetRestorePurchase();
	const navigate = useNavigate();
	const handleRestoring = useCallback(() => {
		setRestoreResult("LOADING_RESTORE");
		openRestoreSheet();

		setTimeout(() => {
			setRestoreResult("PENDING");
			setTimeout(() => {
				void restore((status) => {
					setRestoreResult(status);
					if (status === "FAILED") {
						return;
					}
					setTimeout(() => {
						closeRestoreSheet();
						navigate("workouts");
					}, 3000);
				});
			}, 2000);
		}, 1500);
	}, [closeRestoreSheet, navigate, openRestoreSheet, restore]);

	const showIndicator = restoreResult === "LOADING_RESTORE" || restoreResult === "PENDING";
	const restoreText = useMemo(() => {
		if (restoreResult === "LOADING_RESTORE") {
			return t(TranslationKeys.PURCHASE_RESTORE_LOADING);
		}
		if (restoreResult === "PENDING") {
			return t(TranslationKeys.PURCHASE_RESTORE_PENDING);
		}
		if (restoreResult === "SUCCESS") {
			return t(TranslationKeys.PURCHASE_RESTORE_SUCCESS);
		}
		if (restoreResult === "FAILED") {
			return t(TranslationKeys.PURCHASE_RESTORE_FAILED);
		}
	}, [restoreResult, t]);

	const handleOpenContact = useCallback(() => {
		Linking.openURL("mailto:pureweight.app@gmail.com").catch(noop);
	}, []);

	return (
		<>
			<HStack ghost style={styles.wrapper}>
				<ThemedPressable onPress={handleOpenContact} ghost>
					<Text textSecondary ghost>
						{t(TranslationKeys.HELP)}
					</Text>
				</ThemedPressable>
				<Text ghost textSecondary>
					&#x2022;
				</Text>
				{showRestore && (
					<>
						<ThemedPressable ghost onPress={handleRestoring}>
							<Text textSecondary ghost>
								{t(TranslationKeys.RESTORE)}
							</Text>
						</ThemedPressable>
						<Text ghost textSecondary>
							&#x2022;
						</Text>
					</>
				)}
				<ThemedPressable ghost onPress={openAgbSheet}>
					<Text textSecondary ghost>
						{t(TranslationKeys.AGB)}
					</Text>
				</ThemedPressable>
				<Text ghost textSecondary>
					&#x2022;
				</Text>
				<ThemedPressable onPress={openDatenschutzSheet} ghost>
					<Text textSecondary ghost>
						{t(TranslationKeys.PRIVACY)}
					</Text>
				</ThemedPressable>
			</HStack>
			<ThemedBottomSheetModal title={t(TranslationKeys.PURCHASE_RESTORE_TITLE)} ref={restoreRef}>
				<PageContent ghost paddingTop={20}>
					<ThemedView round padding>
						<Text center style={styles.restoreText}>
							{restoreText}
						</Text>
					</ThemedView>
					{restoreResult === "FAILED" && (
						<ThemedPressable onPress={handleOpenContact} ghost padding style={styles.margin}>
							<Text ghost center>
								{t(TranslationKeys.PURCHASE_RESTORE_CONTACT)}
							</Text>
						</ThemedPressable>
					)}
					{showIndicator && <ActivityIndicator size="large" style={styles.marginLarge} />}
				</PageContent>
			</ThemedBottomSheetModal>
			<AGB reference={agbRef} />
			<Datenschutz reference={datenschutzRef} />
		</>
	);
};
