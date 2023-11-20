import { LanguageSelection } from "../../../components/App/settings/components/LanguageSelection/LanguageSelection";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { ProfileContent } from "../../../components/App/settings/components/SettingsSection/ProfileSection";
import { emptyState, setMockState, setState } from "../../../store/reducer";
import { useAppDispatch } from "../../../store";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { ThemeSelection } from "../../../components/App/settings/components/ThemeSelection/ThemeSelection";
import { ThemedPressable } from "../../../components/Themed/Pressable/Pressable";
import { Text } from "../../../components/Themed/ThemedText/Text";
import { borderRadius } from "../../../theme/border";

const isProduction = process.env["EXPO_PUBLIC_IS_PRODUCTION"] === "true";

export function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigateBack = useCallback(() => {
    navigate("profile");
  }, [navigate]);
  const dispatch = useAppDispatch();
  return (
    <ThemedView stretch>
      <SiteNavigationButtons titleFontSize={30} handleBack={handleNavigateBack} title={t("settings")} />
      <PageContent style={{ gap: 10 }}>
        <LanguageSelection />
        <ThemeSelection />
        {!isProduction && (
          <ProfileContent title="Development">
            <ThemedPressable style={{ padding: 15, borderRadius }} input onPress={() => dispatch(setMockState())}>
              <Text style={{ fontSize: 20 }} center input>
                Use mock state
              </Text>
            </ThemedPressable>
            <ThemedPressable style={{ padding: 15, borderRadius }} input onPress={() => dispatch(setState(emptyState))}>
              <Text style={{ fontSize: 20 }} input center>
                Use empty state
              </Text>
            </ThemedPressable>
          </ProfileContent>
        )}
      </PageContent>
    </ThemedView>
  );
}
