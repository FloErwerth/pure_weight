import { LanguageSelection } from "../../../components/App/settings/components/LanguageSelection/LanguageSelection";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useNavigate } from "../../../hooks/navigate";
import { PageContent } from "../../../components/PageContent/PageContent";
import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { ThemeSelection } from "../../../components/App/settings/components/ThemeSelection/ThemeSelection";
import { UnitSection } from "../../../components/App/settings/components/WeightSection/UnitSection";
import { DevelopmentSelection } from "../../../components/App/settings/components/DevelopmentSection/DevelopmentSelection";

const isProduction = process.env["EXPO_PUBLIC_IS_PRODUCTION"] === "true";

export function Settings() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleNavigateBack = useCallback(() => {
        navigate("profile");
    }, [navigate]);
    return (
        <ThemedView stretch>
            <SiteNavigationButtons titleFontSize={30} handleBack={handleNavigateBack} title={t("settings")} />
            <PageContent scrollable style={{ gap: 10 }}>
                <LanguageSelection />
                <ThemeSelection />
                <UnitSection />
                {!isProduction && <DevelopmentSelection />}
            </PageContent>
        </ThemedView>
    );
}
