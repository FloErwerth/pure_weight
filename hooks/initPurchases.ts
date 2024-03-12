import { useCallback, useEffect } from "react";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import { useAppDispatch } from "../store";
import { setAvailablePackages } from "../store/reducers/purchase";

const apiKeys = {
    ios: "appl_sXUKTyeqNMaeBunaBoVeCypTlnV",
};

export const useInitPurchases = () => {
    const dispatch = useAppDispatch();

    const loadOfferings = useCallback(async () => {
        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
            dispatch(setAvailablePackages(offerings.current.availablePackages));
        }
    }, []);

    const initPurchases = useCallback(async () => {
        if (Platform.OS === "ios") {
            Purchases.configure({ apiKey: apiKeys.ios });
        }
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }, []);

    useEffect(() => {
        initPurchases().then(loadOfferings);
    }, []);
};
