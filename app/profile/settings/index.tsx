import { LanguageSelection } from "../../../components/App/settings/components/LanguageSelection/LanguageSelection";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { ProfileContent } from "../../../components/App/settings/components/SettingsSection/ProfileSection";
import { Button } from "../../../components/Themed/Button/Button";
import { emptyState, setMockState, setState } from "../../../store/reducer";
import { useAppDispatch } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { ThemeSelection } from "../../../components/App/settings/components/ThemeSelection/ThemeSelection";

export function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigateBack = useCallback(() => {
    navigate("profile");
  }, [navigate]);
  const dispatch = useAppDispatch();
  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons handleBack={handleNavigateBack} title={t("settings")} />
      <PageContent style={{ gap: 10 }}>
        <LanguageSelection />
        <ThemeSelection />
        <ProfileContent title="Development">
          <Button title={"Use Mock State"} onPress={() => dispatch(setMockState())} />
          <Button title={"Use empty state"} onPress={() => dispatch(setState(emptyState))} />
        </ProfileContent>
      </PageContent>
    </ThemedView>
  );
}
