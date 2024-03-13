import { useCallback, useEffect } from "react";
import Purchases, { LOG_LEVEL, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import { useAppDispatch } from "../store";
import { setAvailablePackages, setPro } from "../store/reducers/purchase";
import { useNavigate } from "./navigate";

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
        if (Platform.OS === "ios") {
            Purchases.configure({ apiKey: apiKeys.ios });
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
