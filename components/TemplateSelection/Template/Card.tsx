import { ThemedPressable } from "../../Themed/Pressable/Pressable";
import { Text } from "../../Themed/ThemedText/Text";
import { getIsoDate, getLocaleDate } from "../../../utils/date";
import { ExerciseTemplate, TimeInput } from "../../../store/reducers/workout/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getLanguage } from "../../../store/reducers/settings/settingsSelectors";
import { ThemedView } from "../../Themed/ThemedView/View";
import { useTranslation } from "react-i18next";
import React, { useCallback } from "react";
import { getMillisecondsFromTimeInput, getTimeDisplayFromMilliseconds } from "../../../utils/timeDisplay";
import { applyTemplateToEditedExercise } from "../../../store/reducers/workout";
import { extractMillisecondsFromId } from "../../../utils/generateId";

type TemplateCardProps = {
    template: ExerciseTemplate;
    onApplyTemplate: () => void;
};

const exerciseTypeMap = {
    WEIGHT_BASED: "weight_based_label_variant",
    TIME_BASED: "time_based_label_variant",
};

const useDisplay = () => {
    return useCallback((timeInput?: TimeInput) => getTimeDisplayFromMilliseconds(getMillisecondsFromTimeInput(timeInput)), []);
};

export const TemplateCard = ({
    template: {
        templateId,
        exerciseMetaData: { name, type, sets, reps, weight, duration, preparation, pause },
    },
    onApplyTemplate,
}: TemplateCardProps) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    const getDisplay = useDisplay();
    const dispatch = useAppDispatch();

    const handleApplyTemplate = useCallback(() => {
        dispatch(applyTemplateToEditedExercise({ templateId }));
        onApplyTemplate();
    }, [dispatch, onApplyTemplate, templateId]);

    return (
        <ThemedPressable onPress={handleApplyTemplate} padding round>
            <Text style={{ fontSize: 22, marginBottom: 10 }}>{name}</Text>
            <ThemedView>
                <Text style={{ marginBottom: 5 }}>
                    {t(exerciseTypeMap[type])} {t("exercise")}
                </Text>
                {type === "WEIGHT_BASED" ? (
                    <>
                        <Text>
                            {t("sets")}: {sets}
                        </Text>
                        <Text>
                            {t("reps")}: {reps}
                        </Text>
                        <Text>
                            {t("weight")}: {weight}
                        </Text>
                    </>
                ) : (
                    <>
                        <Text>
                            {t("duration")}: {getDisplay(duration)}
                        </Text>
                        {preparation && (
                            <Text>
                                {t("preparation")}: {getDisplay(preparation)}
                            </Text>
                        )}
                    </>
                )}
                {pause && (
                    <Text>
                        {t("pause")}: {getDisplay(pause)}
                    </Text>
                )}
            </ThemedView>
            <Text style={{ color: "#666", fontStyle: "italic", alignSelf: "flex-end" }}>
                Created at {getLocaleDate(getIsoDate(extractMillisecondsFromId(templateId)), language, { dateStyle: "short" })}
            </Text>
        </ThemedPressable>
    );
};
