import { useTranslation } from "react-i18next";
import { useNavigate } from "../../../hooks/navigate";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { useCallback } from "react";
import { SettingsNavigator } from "../../../components/App/settings/components/SettingsSection/SettingsNavigator";

export const Statistics = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavigateToEntries = useCallback(() => {
        navigate("entries");
    }, [navigate]);

    return (
        <ThemedView stretch background>
            <SettingsNavigator title={t("number_entries")} onPress={handleNavigateToEntries} />
        </ThemedView>
    );
};
