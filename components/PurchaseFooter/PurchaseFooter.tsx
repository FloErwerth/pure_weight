import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { HStack } from "../Stack/HStack/HStack";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Linking } from "react-native";
import { noop } from "lodash";
import { PageContent } from "../PageContent/PageContent";
import { ThemedView } from "../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { useGetRestorePurchase } from "../../hooks/purchases";
import { useNavigate } from "../../hooks/navigate";

export const PurchaseFooter = () => {
    const { t } = useTranslation();
    const [restoreResult, setRestoreResult] = useState<"LOADING_RESTORE" | "PENDING" | "SUCCESS" | "FAILED" | undefined>(undefined);
    const { ref: restoreRef, openBottomSheet: openRestoreSheet, closeBottomSheet: closeRestoreSheet } = useBottomSheetRef();
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
            return t("purchase_restore_loading");
        }
        if (restoreResult === "PENDING") {
            return t("purchase_restore_pending");
        }
        if (restoreResult === "SUCCESS") {
            return t("purchase_restore_success");
        }
        if (restoreResult === "FAILED") {
            return t("purchase_restore_failed");
        }
    }, [restoreResult, t]);

    const handleOpenContact = useCallback(() => {
        Linking.openURL("mailto:pureweight.app@gmail.com").catch(noop);
    }, []);

    return (
        <>
            <HStack ghost style={{ justifyContent: "space-evenly" }}>
                <ThemedPressable onPress={handleOpenContact} ghost>
                    <Text textSecondary ghost>
                        {t("help")}
                    </Text>
                </ThemedPressable>
                <Text ghost textSecondary>
                    &#x2022;
                </Text>
                <ThemedPressable ghost onPress={handleRestoring}>
                    <Text textSecondary ghost>
                        {t("restore")}
                    </Text>
                </ThemedPressable>
                <Text ghost textSecondary>
                    &#x2022;
                </Text>
                <ThemedPressable ghost>
                    <Text textSecondary ghost>
                        {t("agb")}
                    </Text>
                </ThemedPressable>
                <Text ghost textSecondary>
                    &#x2022;
                </Text>
                <ThemedPressable ghost>
                    <Text textSecondary ghost>
                        {t("privacy")}
                    </Text>
                </ThemedPressable>
            </HStack>
            <ThemedBottomSheetModal title={t("purchase_restore_title")} ref={restoreRef}>
                <PageContent ghost paddingTop={20}>
                    <ThemedView round padding>
                        <Text center style={{ fontSize: 22 }}>
                            {restoreText}
                        </Text>
                    </ThemedView>
                    {restoreResult === "FAILED" && (
                        <ThemedPressable onPress={handleOpenContact} ghost padding style={{ marginTop: 15 }}>
                            <Text ghost center>
                                {t("purchase_restore_contact")}
                            </Text>
                        </ThemedPressable>
                    )}
                    {showIndicator && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
                </PageContent>
            </ThemedBottomSheetModal>
        </>
    );
};
