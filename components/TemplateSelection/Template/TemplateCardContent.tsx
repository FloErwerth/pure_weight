import { Text } from "../../Themed/ThemedText/Text";
import { ThemedView } from "../../Themed/ThemedView/View";
import { getIsoDate, getLocaleDate } from "../../../utils/date";
import React, { useCallback, useMemo } from "react";
import { useAppSelector } from "../../../store";
import { getLanguage } from "../../../store/reducers/settings/settingsSelectors";
import { useTranslation } from "react-i18next";
import { ExerciseTemplate, TimeInput } from "../../../store/reducers/workout/types";
import { getMillisecondsFromTimeInput, getTimeDisplayFromMilliseconds } from "../../../utils/timeDisplay";

type TemplateCardContentProps = {
    template: ExerciseTemplate;
};

const exerciseTypeMap = {
    WEIGHT_BASED: "weight_based_label_variant",
    TIME_BASED: "time_based_label_variant",
};

const useDisplay = () => {
    return useCallback((timeInput?: TimeInput) => getTimeDisplayFromMilliseconds(getMillisecondsFromTimeInput(timeInput)), []);
};

export const TemplateCardContent = ({
    template: {
        updated,
        creationTimestamp,
        exerciseMetaData: { type, name, sets, reps, duration, preparation, weight, pause },
    },
}: TemplateCardContentProps) => {
    const language = useAppSelector(getLanguage);
    const { t } = useTranslation();
    const getDisplay = useDisplay();

    const mappedSet = useMemo(
        () => (
            <>
                {t("sets")}: {sets}
            </>
        ),
        [sets, t],
    );

    const mappedReps = useMemo(
        () => (
            <>
                {t("reps")}: {reps}
            </>
        ),
        [reps, t],
    );

    const mappedWeight = useMemo(
        () => (
            <>
                {t("weight")}: {weight}
            </>
        ),
        [weight, t],
    );

    const mappedDuration = useMemo(
        () => (
            <>
                {t("duration")}: {getDisplay(duration)}
            </>
        ),
        [duration, getDisplay, t],
    );

    const mappedPreparation = useMemo(
        () => (
            <>
                {t("preparation")}: {getDisplay(preparation)}
            </>
        ),
        [preparation, getDisplay, t],
    );

    const mappedPause = useMemo(
        () => (
            <>
                {t("pause")}: {getDisplay(pause)}
            </>
        ),
        [pause, getDisplay, t],
    );
    const createdDate = useMemo(
        () =>
            `${t(updated ? "edit_template_updated_at" : "edit_template_created_at")} ${getLocaleDate(
                getIsoDate(creationTimestamp),
                language,
                {
                    dateStyle: "long",
                },
            )}`,
        [t, updated, creationTimestamp, language],
    );

    return (
        <ThemedView>
            <Text style={{ fontSize: 22, marginBottom: 10 }}>{name}</Text>
            <ThemedView>
                <Text style={{ marginBottom: 5 }}>
                    {t(exerciseTypeMap[type])} {t("exercise")}
                </Text>
                {type === "WEIGHT_BASED" ? (
                    <>
                        <Text>{mappedSet}</Text>
                        <Text>{mappedReps}</Text>
                        <Text>{mappedWeight}</Text>
                    </>
                ) : (
                    <>
                        <Text>{mappedDuration}</Text>
                        {preparation && <Text>{mappedPreparation}</Text>}
                    </>
                )}
                {pause && <Text>{mappedPause}</Text>}
            </ThemedView>
            <Text style={{ color: "#666", fontStyle: "italic", alignSelf: "flex-end" }}>{createdDate}</Text>
        </ThemedView>
    );
};
