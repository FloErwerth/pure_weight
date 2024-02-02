import { useTranslation } from "react-i18next";
import { PageContent } from "../../../../PageContent/PageContent";
import { ProfileContent } from "../../components/ProfileContent/ProfileContent";
import { SettingsNavigator } from "../../SettingsSection/SettingsNavigator";
import { useAppSelector } from "../../../../../store";
import { getHasTemplates } from "../../../../../store/reducers/workout/workoutSelectors";

export const TemplateSection = () => {
    const { t } = useTranslation();
    const helpTitleConfig = { title: t("template_section_title"), size: 30 } as const;
    const hasTemplates = useAppSelector(getHasTemplates);

    if (!hasTemplates) {
        return null;
    }

    return (
        <PageContent titleConfig={helpTitleConfig} background paddingTop={30}>
            <ProfileContent>
                <SettingsNavigator page="settings/templates/index" title={t("settings_exercises_title")} />
            </ProfileContent>
        </PageContent>
    );
};
