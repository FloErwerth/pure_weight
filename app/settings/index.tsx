import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigate } from "../../utils/navigate";
import { useTranslation } from "react-i18next";
import { LanguageSelection } from "../../components/App/settings/components/LanguageSelection/LanguageSelection";
import { ThemedView } from "../../components/View/View";

export default function Index() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons title={t("settings")} />
      <LanguageSelection />
    </ThemedView>
  );
}
