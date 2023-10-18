import { SafeAreaView } from "../../components/SafeAreaView/SafeAreaView";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { useTranslation } from "react-i18next";
import { LanguageSelection } from "./components/LanguageSelection/LanguageSelection";

export default function Index() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <SafeAreaView>
      <SiteNavigationButtons handleBack={() => navigate(Routes.HOME)} title={t("settings")} />
      <LanguageSelection />
    </SafeAreaView>
  );
}
