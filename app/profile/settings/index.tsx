import { LanguageSelection } from "../../../components/App/settings/components/LanguageSelection/LanguageSelection";
import { ThemedView } from "../../../components/View/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useNavigate } from "../../../hooks/navigate";

export function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigateBack = useCallback(() => {
    navigate("profile");
  }, [navigate]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons handleBack={handleNavigateBack} title={t("settings")} />
      <LanguageSelection />
    </ThemedView>
  );
}
