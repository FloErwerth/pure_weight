import { useAppSelector } from "../../store";
import React, { useCallback } from "react";
import { getIsPro } from "../../store/selectors/purchases";
import { useNavigate } from "../../hooks/navigate";
import { getLanguage } from "../../store/selectors/settings/settingsSelectors";
import { InlinePressable } from "../InlinePressable/InlinePressable";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { getMeasurements } from "../../store/selectors/measurements/measurementSelectors";

export const RemainingMeasurementsText = () => {
    const numberOfWorkouts = useAppSelector(getMeasurements).length;
    const isPro = useAppSelector(getIsPro);
    const navigate = useNavigate();
    const language = useAppSelector(getLanguage);

    const handleNavigateToPurchase = useCallback(() => {
        navigate("purchase");
    }, [navigate]);

    if (isPro) {
        return undefined;
    }

    if (language === "de") {
        return (
            <Text ghost style={styles.hint}>
                {numberOfWorkouts} von 3 Messungen erstellt. Werde{" "}
                <InlinePressable cta textSize={16} handlePress={handleNavigateToPurchase}>
                    PRO
                </InlinePressable>
                , um die Begrenzung aufzuheben
            </Text>
        );
    }
    return (
        <Text ghost style={styles.hint}>
            {numberOfWorkouts} of 3 measurements created. Become{" "}
            <InlinePressable cta textSize={16} handlePress={handleNavigateToPurchase}>
                PRO
            </InlinePressable>
            , to unlock this limit
        </Text>
    );
};
