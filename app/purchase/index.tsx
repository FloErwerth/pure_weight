import { ThemedView } from "../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigate, useNavigateBack } from "../../hooks/navigate";
import { PageContent } from "../../components/PageContent/PageContent";
import { useAppSelector } from "../../store";
import { getAvailablePackages } from "../../store/selectors/purchases";
import { Text } from "../../components/Themed/ThemedText/Text";
import { ThemedPressable } from "../../components/Themed/Pressable/Pressable";
import { Fragment, RefObject, useCallback, useMemo, useState } from "react";
import { useBuyPackage, useGetRestorePurchase } from "../../hooks/purchases";
import { z } from "zod";
import { HStack } from "../../components/Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { trunicateToNthSignificantDigit } from "../../utils/number";
import { getLanguage } from "../../store/selectors/settings/settingsSelectors";
import { useTheme } from "../../theme/context";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../components/BottomSheetModal/ThemedBottomSheetModal";
import { Language } from "../../store/reducers/settings/types";
import { useTranslation } from "react-i18next";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ActivityIndicator, Image, Linking } from "react-native";
import EN_Graph from "../../media/pictures/en_graph.png";
import DE_Graph from "../../media/pictures/de_graph.png";
import EN_Performance from "../../media/pictures/en_workout_progress_display.png";
import DE_Performance from "../../media/pictures/de_workout_progress_display.png";
import { noop } from "lodash";

const productIdToDataMap = {
    einmonat: {
        en: {
            title: "Monthly subscription",
            text: "1 month Pure Weight",
            getPriceText: (priceString: string) => `${priceString} per month`,
        },
        de: {
            title: "Monatsabo",
            text: "1 Monat Pure Weight",
            getPriceText: (priceString: string) => `${priceString} pro Monat`,
        },
    },
    einjahr: {
        en: {
            title: "Yearly subscription",
            text: "1 year Pure Weight",
            getPriceText: (priceString: string) => `${priceString} per year`,
        },
        de: {
            title: "Jahresabo",
            text: "1 Jahr Pure Weight",
            getPriceText: (priceString: string) => `${priceString} pro Jahr`,
        },
    },
    pureweightforever: {
        en: {
            title: "Forever Pure Weight",
            text: "Buy Pure Weight forever",
            getPriceText: (priceString: string) => priceString,
        },
        de: {
            title: "Pure Weight kaufen",
            text: "Kaufe Pure Weight für immer",
            getPriceText: (priceString: string) => priceString,
        },
    },
} as const;

const productParser = (languague: Language) =>
    z
        .object({
            identifier: z.enum(["einmonat", "einjahr", "pureweightforever"]),
            title: z.string(),
            priceString: z.string(),
            price: z.number(),
            description: z.string(),
            currencyCode: z.string(),
        })
        .transform((data) => {
            return {
                identifier: data.identifier,
                text: productIdToDataMap[data.identifier][languague].text,
                priceString: data.priceString,
                price: data.price,
                currencyCode: data.currencyCode,
                title: productIdToDataMap[data.identifier][languague].title,
                priceText: productIdToDataMap[data.identifier][languague].getPriceText(data.priceString),
            };
        });

type PurchaseBottomSheetType = "graphs" | "infinite" | "future" | "performance";
type PurchaseBottomSheetProps = {
    reference: RefObject<BottomSheetModal>;
    type: PurchaseBottomSheetType | undefined;
};
const PurchaseBottomSheet = ({ reference, type }: PurchaseBottomSheetProps) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();

    const Content = useCallback(() => {
        if (type === "graphs") {
            return (
                <ThemedView ghost style={{ gap: 10 }}>
                    <ThemedView round style={{ overflow: "hidden" }}>
                        <Image style={{ width: "100%", height: 350 }} source={language === "en" ? EN_Graph : DE_Graph} />
                    </ThemedView>
                    <Text center style={{ fontWeight: "bold", fontSize: 26, marginBottom: 10, marginTop: 20 }} ghost>
                        {t("purchase_graphs")}
                    </Text>
                    <Text center ghost>
                        {t("purchase_graphs_content_1")}
                    </Text>
                    <Text center ghost>
                        {t("purchase_graphs_content_2")}
                    </Text>
                </ThemedView>
            );
        }
        if (type === "performance") {
            return (
                <ThemedView ghost style={{ gap: 10 }}>
                    <ThemedView round style={{ overflow: "hidden" }}>
                        <Image style={{ width: "100%", height: 70 }} source={language === "en" ? EN_Performance : DE_Performance} />
                    </ThemedView>
                    <Text center style={{ fontWeight: "bold", fontSize: 26, marginBottom: 10, marginTop: 20 }} ghost>
                        {t("purchase_performance")}
                    </Text>
                    <Text center ghost>
                        {t("purchase_performance_content_1")}
                    </Text>
                    <Text center ghost>
                        {t("purchase_performance_content_2")}
                    </Text>
                </ThemedView>
            );
        }
        if (type === "infinite") {
            return (
                <ThemedView ghost style={{ gap: 10 }}>
                    <Text center style={{ fontWeight: "bold", fontSize: 26, marginBottom: 10 }} ghost>
                        {t("purchase_infinite_plans")}
                    </Text>
                    <Text center ghost>
                        {t("purchase_infinite_plans_content")}
                    </Text>
                </ThemedView>
            );
        }
        if (type === "future") {
            return (
                <ThemedView ghost style={{ gap: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 26, textAlign: "center", marginBottom: 10 }} ghost>
                        {t("purchase_future_features")}
                    </Text>
                    <Text ghost center>
                        {t("purchase_future_features_content")}
                    </Text>
                </ThemedView>
            );
        }
    }, [language, t, type]);

    return (
        <ThemedBottomSheetModal ref={reference}>
            <PageContent safeBottom stretch ghost paddingTop={20}>
                <Content />
            </PageContent>
        </ThemedBottomSheetModal>
    );
};

export const Purchase = () => {
    const navigateBack = useNavigateBack();
    const packages = useAppSelector(getAvailablePackages);
    const buyPackage = useBuyPackage();
    const navigate = useNavigate();
    const [restoreResult, setRestoreResult] = useState<"LOADING_RESTORE" | "PENDING" | "SUCCESS" | "FAILED" | undefined>(undefined);
    const restore = useGetRestorePurchase();
    const { ref: restoreRef, openBottomSheet: openRestoreSheet, closeBottomSheet: closeRestoreSheet } = useBottomSheetRef();

    const language = useAppSelector(getLanguage);
    const { ref, openBottomSheet } = useBottomSheetRef();
    const { ref: moreInfoRef, openBottomSheet: openMoreInfo } = useBottomSheetRef();
    const [infoType, setInfoType] = useState<PurchaseBottomSheetType | undefined>(undefined);
    const { cta } = useTheme();
    const { t } = useTranslation();

    const mappedPackages = useMemo(
        () =>
            packages.map((pack) => {
                const parsedPackages = productParser(language).safeParse(pack.product);
                if (parsedPackages.success) {
                    return {
                        identifier: parsedPackages.data.identifier,
                        purchasePackage: () => buyPackage(pack),
                        text: parsedPackages.data.text,
                        title: parsedPackages.data.title,
                        priceString: parsedPackages.data.priceString,
                        price: parsedPackages.data.price,
                        currencyCode: parsedPackages.data.currencyCode,
                        priceText: parsedPackages.data.priceText,
                    };
                }
            }),
        [packages, language, buyPackage],
    );

    const buyYearlyPackage = useCallback(() => {
        const yearlyPackage = mappedPackages.find((pack) => pack?.identifier === "einjahr");

        return yearlyPackage?.purchasePackage();
    }, [mappedPackages]);

    const handleOpenMoreInfo = useCallback(
        (type: PurchaseBottomSheetType) => {
            setInfoType(type);
            openMoreInfo();
        },
        [openMoreInfo],
    );

    const handleOpenGraphsInfo = useCallback(() => {
        handleOpenMoreInfo("graphs");
    }, [handleOpenMoreInfo]);

    const handleOpenPerformanceInfo = useCallback(() => {
        handleOpenMoreInfo("performance");
    }, [handleOpenMoreInfo]);

    const handleOpenInfiniteInfo = useCallback(() => {
        handleOpenMoreInfo("infinite");
    }, [handleOpenMoreInfo]);

    const handleOpenFutureInfo = useCallback(() => {
        handleOpenMoreInfo("future");
    }, [handleOpenMoreInfo]);

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

    const lockText = useMemo(() => {
        const yearly = mappedPackages.find((pack) => pack?.identifier === "einjahr");
        if (yearly) {
            const price = trunicateToNthSignificantDigit(yearly.price, true, 2);
            const monthlyPrice = trunicateToNthSignificantDigit(price / 12, true, 2);

            const montlyPriceFormatted = Intl.NumberFormat(language, { currency: yearly.currencyCode, style: "currency" }).format(monthlyPrice);
            const yearlyPriceFormatted = Intl.NumberFormat(language, { currency: yearly.currencyCode, style: "currency" }).format(yearly.price);

            const perYearOr = language === "de" ? "pro Jahr" : "per year";
            const perMonth = language === "de" ? "pro Monat" : "per month";

            return `${yearlyPriceFormatted} ${perYearOr} - ${montlyPriceFormatted} ${perMonth}`;
        }
        return "Lade...";
    }, [mappedPackages, language]);

    const handleOpenContact = useCallback(() => {
        Linking.openURL("mailto:pureweight.app@gmail.com").catch(noop);
    }, []);

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons title={t("purchase")} backButtonAction={navigateBack} />
            <PageContent safeBottom stretch ghost paddingTop={40}>
                <Text ghost style={{ fontSize: 40, textAlign: "center", marginBottom: 20 }}>
                    {t("purchase_title")}
                </Text>
                <PageContent stretch ignorePadding ghost style={{ marginBottom: 20 }}>
                    <ThemedPressable onPress={handleOpenGraphsInfo} padding round>
                        <HStack center ghost gap>
                            <ThemedMaterialCommunityIcons name="chart-timeline-variant-shimmer" size={24} ghost />
                            <Text>{t("purchase_graphs")}</Text>
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable onPress={handleOpenPerformanceInfo} padding round>
                        <HStack center ghost gap>
                            <ThemedMaterialCommunityIcons name="poll" size={24} ghost />
                            <Text>{t("purchase_performance")}</Text>
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable onPress={handleOpenInfiniteInfo} padding round>
                        <HStack center ghost gap style={{ marginRight: 15 }}>
                            <ThemedMaterialCommunityIcons name="infinity" size={24} ghost />
                            <Text>{t("purchase_infinite_plans")}</Text>
                        </HStack>
                    </ThemedPressable>
                    <ThemedPressable onPress={handleOpenFutureInfo} padding round>
                        <HStack center ghost gap>
                            <ThemedMaterialCommunityIcons name="star-plus-outline" size={24} ghost />
                            <Text>{t("purchase_future_features")}</Text>
                        </HStack>
                    </ThemedPressable>
                </PageContent>

                <ThemedView ghost style={{ marginBottom: 20 }}>
                    <ThemedPressable onPress={buyYearlyPackage} center cta padding round>
                        <HStack ghost style={{ gap: 10 }} center>
                            <ThemedMaterialCommunityIcons textCta ghost name="lock-open-variant-outline" size={24} />
                            <Text textCta ghost center>
                                {t("purchase_unlock_now")}
                            </Text>
                        </HStack>
                    </ThemedPressable>
                    <Text center style={{ marginTop: 5 }} ghost>
                        {lockText}
                    </Text>
                </ThemedView>
                <ThemedPressable ghost onPress={openBottomSheet}>
                    <Text ghost center style={{ color: cta, fontSize: 26, marginBottom: 10 }}>
                        {t("purchase_show_all")}
                    </Text>
                </ThemedPressable>
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
                <ThemedBottomSheetModal ref={ref}>
                    <PageContent safeBottom stretch ghost paddingTop={20}>
                        <Text ghost style={{ fontSize: 30, textAlign: "center", marginBottom: 20 }}>
                            {t("purchase_title")}
                        </Text>
                        <ThemedView stretch secondary round style={{ gap: 10, padding: 10, marginBottom: 20 }}>
                            <ThemedPressable onPress={handleOpenGraphsInfo} ghost round>
                                <HStack center ghost gap>
                                    <ThemedMaterialCommunityIcons name="chart-timeline-variant-shimmer" size={24} ghost />
                                    <Text ghost>{t("purchase_graphs")}</Text>
                                </HStack>
                            </ThemedPressable>
                            <ThemedPressable onPress={handleOpenPerformanceInfo} ghost round>
                                <HStack center ghost gap>
                                    <ThemedMaterialCommunityIcons name="poll" size={24} ghost />
                                    <Text ghost>{t("purchase_performance")}</Text>
                                </HStack>
                            </ThemedPressable>
                            <ThemedPressable onPress={handleOpenInfiniteInfo} ghost round>
                                <HStack center ghost gap style={{ marginRight: 15 }}>
                                    <ThemedMaterialCommunityIcons name="infinity" size={24} ghost />
                                    <Text ghost>{t("purchase_infinite_plans")}</Text>
                                </HStack>
                            </ThemedPressable>
                            <ThemedPressable onPress={handleOpenFutureInfo} ghost round>
                                <HStack center ghost gap>
                                    <ThemedMaterialCommunityIcons name="star-plus-outline" size={24} ghost />
                                    <Text ghost>{t("purchase_future_features")}</Text>
                                </HStack>
                            </ThemedPressable>
                        </ThemedView>
                        {mappedPackages.map((pack) => (
                            <Fragment key={pack?.identifier}>
                                <>
                                    {pack && (
                                        <ThemedView ghost round style={{ marginBottom: pack.identifier === "einjahr" ? 10 : 0 }}>
                                            {pack.identifier === "einjahr" && (
                                                <Text ghost style={{ paddingBottom: 5 }}>
                                                    {t("purchase_best_offer")}
                                                </Text>
                                            )}
                                            <ThemedPressable onPress={pack.purchasePackage} padding round cta={pack.identifier === "einjahr"}>
                                                <Text textCta={pack.identifier === "einjahr"} ghost style={{ fontSize: 30 }}>
                                                    {pack.title}
                                                </Text>
                                                <Text ghost textCta={pack.identifier === "einjahr"} style={{ fontSize: 16 }}>
                                                    {pack.priceText}
                                                </Text>
                                            </ThemedPressable>
                                        </ThemedView>
                                    )}
                                </>
                            </Fragment>
                        ))}
                    </PageContent>
                </ThemedBottomSheetModal>
                <PurchaseBottomSheet reference={moreInfoRef} type={infoType} />
            </PageContent>
        </ThemedView>
    );
};
