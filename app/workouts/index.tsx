import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "../../hooks/navigate";
import { useAppDispatch, useAppSelector } from "../../store";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { getWorkouts } from "../../store/reducers/workout/workoutSelectors";
import { createNewWorkout, recoverWorkout, removeWorkout, setEditedWorkout, startWorkout } from "../../store/reducers/workout";
import { WorkoutSorting } from "../../components/App/train/WorkoutSorting/WorkoutSorting";
import { RenderedWorkout } from "../../components/App/workout/RenderedWorkout";
import { PageContent } from "../../components/PageContent/PageContent";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { BottomToast } from "../../components/BottomToast/BottomToast";

export function Workouts() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(false);

    const savedWorkouts = useAppSelector(getWorkouts);
    const navigate = useNavigate();

    const handleCreateWorkout = useCallback(() => {
        dispatch(createNewWorkout());
        navigate("create");
    }, [dispatch, navigate]);

    const confirmIcon = useMemo((): { name: "plus"; size: number } => ({ name: "plus", size: 40 }), []);

    const onEdit = useCallback(
        (index: number) => {
            dispatch(setEditedWorkout({ index }));
            navigate("create");
        },
        [dispatch, navigate],
    );

    const onDelete = useCallback(
        (index: number) => {
            dispatch(removeWorkout(index));
            setShowToast(true);
        },
        [dispatch],
    );

    const onClick = useCallback(
        (index: number) => {
            dispatch(startWorkout(index));
            navigate("train");
        },
        [dispatch, navigate],
    );
    const handleRecoverWorkout = useCallback(() => {
        dispatch(recoverWorkout());
        setShowToast(false);
    }, [dispatch]);

    const mappedWorkouts = useMemo(
        () =>
            savedWorkouts.map(({ name }, index) => (
                <Swipeable key={name.concat(index.toString())} onClick={() => onClick(index)} onDelete={() => onDelete(index)} onEdit={() => onEdit(index)}>
                    <RenderedWorkout index={index} />
                </Swipeable>
            )),
        [savedWorkouts, onClick, onDelete, onEdit],
    );

    return (
        <ThemedView stretch background>
            <SiteNavigationButtons titleFontSize={40} title={t("workouts")} handleConfirmIcon={confirmIcon} handleConfirm={handleCreateWorkout} />
            <WorkoutSorting />
            <PageContent paddingTop={20}>{mappedWorkouts}</PageContent>
            <BottomToast onRequestClose={() => setShowToast(false)} open={showToast} messageKey={"workout_deleted_message"} titleKey={"workout_deleted_title"} onRedo={handleRecoverWorkout} />
        </ThemedView>
    );
}
