import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { ProfileSection } from "../../components/App/settings/components/SettingsSection/ProfileSection";
import { Routes, useNavigate } from "../../hooks/navigate";
import { useCallback } from "react";
import { PageContent } from "../../components/PageContent/PageContent";

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
      <PageContent style={{ gap: 10 }}>
        <ProfileSection onPress={() => handleNavigation("measurements")} title={t("measurements")} />
        <ProfileSection onPress={() => handleNavigation("settings")} title={t("settings")} />
      </PageContent>
    </ThemedView>
  );
}
