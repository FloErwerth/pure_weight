import { SiteNavigationButtons } from "../../../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigate } from "../../../../hooks/navigate";
import { useCallback } from "react";
import { ThemedView } from "../../../../components/Themed/ThemedView/View";
import { PageContent } from "../../../../components/PageContent/PageContent";
import { HelpQuestionAnswer } from "../../../../components/HelpQuestionAnswer/HelpQuestionAnswer";
import { AnswerText } from "../../../../components/HelpQuestionAnswer/AnswerText";
import { InlinePressable } from "../../../../components/InlinePressable/InlinePressable";
import { ThemedMaterialCommunityIcons } from "../../../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedPressable } from "../../../../components/Themed/Pressable/Pressable";
import { Text } from "../../../../components/Themed/ThemedText/Text";
import { useAppDispatch } from "../../../../store";
import { createNewWorkout } from "../../../../store/reducers/workout";
import { useBottomSheetRef } from "../../../../components/BottomSheetModal/ThemedBottomSheetModal";

export const HelpFaqs = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [ref, open, close, closeAll] = useBottomSheetRef();
    const handleBack = useCallback(() => {
        navigate("settings");
    }, [navigate]);

    const handleNavigateToWorkouts = useCallback(() => {
        navigate("workouts");
    }, [navigate]);

    const setupNewWorkout = useCallback(() => {
        closeAll();
        navigate("create");
        dispatch(createNewWorkout());
    }, [closeAll, dispatch, navigate]);

    return (
        <ThemedView background stretch>
            <SiteNavigationButtons title="FAQs" handleBack={handleBack} />
            <PageContent background safeBottom scrollable>
                <HelpQuestionAnswer
                    question="Wie kann ich ein Workout erstellen?"
                    title="Erstellung eines Workouts"
                    answer={
                        <ThemedView ghost stretch style={{ gap: 20 }}>
                            <AnswerText>
                                <InlinePressable handlePress={handleNavigateToWorkouts}>Navigiere zu Workouts</InlinePressable>, klicke auf das Plus-Symbol und erstelle die Übungen, die du in dein
                                Workout einbauen möchtest. {"\n\n"}
                                Wenn Du fertig bist, klicke auf das <ThemedMaterialCommunityIcons name="check" size={30} ghost />
                                -Symbol oben rechts im Workout-Erstellen Bildschirm.
                            </AnswerText>
                            <ThemedPressable onPress={setupNewWorkout} center padding round>
                                <Text style={{ fontSize: 16 }}>Klicke hier, um sofort ein neues Workout zu erstellen</Text>
                            </ThemedPressable>
                        </ThemedView>
                    }
                />
            </PageContent>
        </ThemedView>
    );
};
