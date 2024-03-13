import { useCallback, useEffect } from "react";
import Purchases, { LOG_LEVEL, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import { useAppDispatch } from "../store";
import { setAvailablePackages, setPro } from "../store/reducers/purchase";
import { useNavigate } from "./navigate";
import uuid from "react-native-uuid";
import * as SecureStore from "expo-secure-store";

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
    }, [dispatch]);

    useEffect(() => {
        initPurchases()
            .then(loadOfferings)
            .catch(() => {
                dispatch(setPro(false));
            });
    }, []);
};
