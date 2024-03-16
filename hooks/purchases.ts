import { useCallback, useEffect } from "react";
import Purchases, { LOG_LEVEL, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import { useAppDispatch } from "../store";
import { setAvailablePackages, setPro } from "../store/reducers/purchase";
import { useNavigate } from "./navigate";
import uuid from "react-native-uuid";
import * as SecureStore from "expo-secure-store";
import { noop } from "lodash";
import { SplashScreen } from "expo-router";

const apiKeys = {
    ios: "appl_sXUKTyeqNMaeBunaBoVeCypTlnV",
};

export const useBuyPackage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return useCallback(
        async (pack: PurchasesPackage) => {
            Purchases.purchasePackage(pack)
                .then(() => {
                    dispatch(setPro(true));
                    navigate("workouts");
                })
                .catch(() => {
                    dispatch(setPro(false));
                });
        },
        [dispatch, navigate],
    );
};

export const useGetRestorePurchase = () => {
    const dispatch = useAppDispatch();

    return useCallback(
        async (onEndRestore: (status: "SUCCESS" | "FAILED") => void) => {
            Purchases.restorePurchases()
                .then((purchaserInfo) => {
                    if (Object.values(purchaserInfo.entitlements.active).length > 0) {
                        SecureStore.getItemAsync("appUserID")
                            .then((appUserID) => {
                                if (appUserID === null) {
                                    SecureStore.setItemAsync("appUserID", uuid.v4() as string);
                                }
                            })
                            .catch(noop);
                        dispatch(setPro(true));
                        onEndRestore("SUCCESS");
                    } else {
                        dispatch(setPro(false));
                        onEndRestore("FAILED");
                    }
                })
                .catch(() => {
                    onEndRestore("FAILED");
                });
        },
        [dispatch],
    );
};

export const useInitPurchases = () => {
    const dispatch = useAppDispatch();

    const loadOfferings = useCallback(async () => {
        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
            dispatch(setAvailablePackages(offerings.current.availablePackages));
        } else {
            dispatch(setPro(false));
        }
    }, [dispatch]);

    const initPurchases = useCallback(async () => {
        let appUserID = await SecureStore.getItemAsync("appUserID");
        if (appUserID === null) {
            appUserID = uuid.v4() as string;
            await SecureStore.setItemAsync("appUserID", appUserID);
        }
        if (Platform.OS === "ios") {
            Purchases.configure({ apiKey: apiKeys.ios, appUserID });
        }
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
            if (Object.values(customerInfo.entitlements.active).length > 0) {
                dispatch(setPro(true));
            } else {
                dispatch(setPro(false));
            }
        });
        SplashScreen.hideAsync();
    }, [dispatch]);

    useEffect(() => {
        initPurchases()
            .then(loadOfferings)
            .catch(() => {
                dispatch(setPro(false));
            });
    }, []);
};
