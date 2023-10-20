import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { LanguageSelection } from "../../components/App/settings/components/LanguageSelection/LanguageSelection";
import { ThemedView } from "../../components/View/View";

export function Settings() {
  const { t } = useTranslation();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons title={t("settings")} />
      <LanguageSelection />
    </ThemedView>
  );
}
