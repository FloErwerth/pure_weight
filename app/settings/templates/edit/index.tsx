import { EditableTemplate } from "../../../../components/EditableTemplate/EditableTemplate";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigateBack } from "../../../../hooks/navigate";
import { useAppDispatch } from "../../../../store";
import { useCallback, useMemo, useState } from "react";
import { saveEditedExerciseTemplate } from "../../../../store/reducers/workout";
import { useTranslation } from "react-i18next";
import { CheckBox } from "../../../../components/Themed/CheckBox/CheckBox";
import { SnapPoint } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";

export const EditableTemplatePage = () => {
    const handleNavigateBack = useNavigateBack();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [adjustAllExercises, setAdjustAllExercises] = useState(false);

    const handleSaveTemplate = useCallback(() => {
        dispatch(saveEditedExerciseTemplate(adjustAllExercises));
        handleNavigateBack();
    }, [adjustAllExercises, dispatch, handleNavigateBack]);

    const title = useMemo(() => t("edit_template"), [t]);
    const helptextTitle = useMemo(() => t("edit_template_adjust_exercises_title"), [t]);
    const helptextText = useMemo(() => t("edit_template_adjust_exercises_text"), [t]);
    const helptextConfig = useMemo(
        () => ({ title: helptextTitle, text: helptextText, snapPoints: ["45%"] as SnapPoint[] }),
        [helptextText, helptextTitle],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons
                handleConfirm={handleSaveTemplate}
                titleFontSize={30}
                title={title}
                handleBack={handleNavigateBack}
            ></SiteNavigationButtons>
            <PageContent stretch safeBottom ghost>
                <EditableTemplate />
                <CheckBox
                    checked={adjustAllExercises}
                    onChecked={setAdjustAllExercises}
                    label={helptextTitle}
                    helpTextConfig={helptextConfig}
                />
            </PageContent>
        </ThemedView>
    );
};
