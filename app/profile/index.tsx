import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/View/View";
import { SettingsSection } from "../../components/App/settings/components/SettingsSection/SettingsSection";
import { Routes, useNavigate } from "../../hooks/navigate";
import { useCallback } from "react";
import {VStack} from "../../components/VStack/VStack";

export function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigation = useCallback(
    (route: keyof typeof Routes) => {
      navigate(route);
    },
    [navigate],
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons title={t("profile")} />
        <VStack style={{padding: 10, paddingHorizontal: 20, gap: 10}}>
      <SettingsSection onPress={() => handleNavigation("measurements")} title={t("measurements")} />
      <SettingsSection onPress={() => handleNavigation("settings")} title={t("settings")} />
        </VStack>
    </ThemedView>
  );
}
