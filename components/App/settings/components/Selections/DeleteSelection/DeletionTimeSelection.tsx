import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { VStack } from "../../../../../Stack/VStack/VStack";
import { selectionStyles } from "../../selectionStyles";
import { setDeletionTimeMs } from "../../../../../../store/reducers/settings";
import { getDeletionTime, getLanguage } from "../../../../../../store/reducers/settings/settingsSelectors";
import { SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { ProfileContent } from "../../ProfileContent/ProfileContent";
import { getMiscellaneousQuestions } from "../../../../help/questions/miscellaneous";
import { useNavigate } from "../../../../../../hooks/navigate";

export const DeletionTimeSelection = () => {
    const { t } = useTranslation();
    const deletionTime = useAppSelector(getDeletionTime);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const language = useAppSelector(getLanguage);

    const handleSetDeletionTime5 = useCallback(() => {
        dispatch(setDeletionTimeMs(5000));
    }, [dispatch]);

    const handleSetDeletionTime10 = useCallback(() => {
        dispatch(setDeletionTimeMs(10000));
    }, [dispatch]);

    const handleSetDeletionTime25 = useCallback(() => {
        dispatch(setDeletionTimeMs(25000));
    }, [dispatch]);

    const navigateToSettings = useCallback(
        (scrollIndex?: number) => {
            navigate("settings", { scrollIndex });
        },
        [navigate],
    );

    const help = getMiscellaneousQuestions(navigateToSettings, language)[0];
    const helpText = useMemo(() => ({ title: t("settings_deletion_time_title"), text: t("settings_deletion_time_helptext_text") }), [help.title, t]);

    return (
        <ProfileContent snapPoints={["40%"]} title={t("settings_deletion_time_title")} helpText={helpText}>
            <VStack style={selectionStyles.vStack}>
                <SelectableSetting position="TOP" selected={deletionTime === 5000} onSelect={handleSetDeletionTime5} titleKey={"settings_deletion_time_5"} />
                <SelectableSetting position="MIDDLE" selected={deletionTime === 10000} onSelect={handleSetDeletionTime10} titleKey={"settings_deletion_time_10"} />
                <SelectableSetting position="BOTTOM" selected={deletionTime === 25000} onSelect={handleSetDeletionTime25} titleKey={"settings_deletion_time_25"} />
            </VStack>
        </ProfileContent>
    );
};
