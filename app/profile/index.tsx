import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/View/View";
import { SettingsSection } from "../../components/App/settings/components/SettingsSection/SettingsSection";
import { Routes, useNavigate } from "../../hooks/navigate";
import { useCallback } from "react";

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
      <SettingsSection onPress={() => handleNavigation("settings")} title={t("settings")} />
    </ThemedView>
  );
}
