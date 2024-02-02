import { ThemedView } from "../../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigate, useNavigateBack } from "../../../hooks/navigate";
import { PageContent } from "../../../components/PageContent/PageContent";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getSortedTemplates } from "../../../store/reducers/workout/workoutSelectors";
import { Swipeable } from "../../../components/WorkoutCard/Swipeable";
import { useCallback, useMemo } from "react";
import { TemplateCardContent } from "../../../components/TemplateSelection/Template/TemplateCardContent";
import { deleteExerciseTemplate, recoverExerciseTemplate, setEditedExerciseTemplate } from "../../../store/reducers/workout";
import { useToast } from "../../../components/BottomToast/useToast";
import { BottomToast } from "../../../components/BottomToast/BottomToast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSorting } from "../../../hooks/useSorting";
import { SortingButton } from "../../../components/SortingButton/SortingButton";
import { styles } from "../../../components/EditableTemplate/Content/styles";

export const ExerciseTemplatesPage = () => {
    const navigateBack = useNavigateBack();
    const templates = useAppSelector(getSortedTemplates);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toastRef, openToast, showToast, closeToast } = useToast();
    const { bottom } = useSafeAreaInsets();
    const sorting = useSorting({ type: "ExerciseTemplate" });
    const handleNavigateToEditTemplate = useCallback(() => {
        navigate("settings/templates/edit/index");
    }, [navigate]);

    const mappedTemplates = useMemo(() => {
        return templates.map((template) => {
            const handleDeleteTemplate = () => {
                dispatch(deleteExerciseTemplate(template.templateId));
                openToast();
            };
            const handleSelectTemplate = () => {
                dispatch(setEditedExerciseTemplate(template));
                handleNavigateToEditTemplate();
            };

            return (
                <Swipeable onClick={handleSelectTemplate} key={template.templateId} onDelete={handleDeleteTemplate}>
                    <ThemedView padding round ghost>
                        <TemplateCardContent template={template} />
                    </ThemedView>
                </Swipeable>
            );
        });
    }, [dispatch, handleNavigateToEditTemplate, openToast, templates]);

    const handleUndo = useCallback(() => {
        dispatch(recoverExerciseTemplate());
        closeToast();
    }, [closeToast, dispatch]);

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons title="Edit exercise templates" handleBack={navigateBack} />
            <SortingButton
                hide={templates.length < 2}
                iconName={sorting.iconName}
                title={sorting.title}
                mappedOptions={sorting.mappedSorting}
            />
            <ThemedView stretch ghost style={styles.gap}>
                <PageContent scrollable safeBottom stretch ghost paddingTop={20}>
                    <ThemedView ghost stretch style={styles.gap}>
                        {mappedTemplates}
                    </ThemedView>
                </PageContent>
            </ThemedView>
            <BottomToast
                bottom={bottom}
                open={showToast}
                onRequestClose={closeToast}
                reference={toastRef}
                messageKey="template_redo"
                titleKey="template_deleted_success"
                onRedo={handleUndo}
            />
        </ThemedView>
    );
};
