import { ExercideDataEntry, ExerciseMetaData } from "../../../store/types";
import { useCallback } from "react";
import { TrainingFormControl } from "../../../components/TrainingFormControl/TrainingFormControl";
import {View} from "react-native";

export type AddExerciseMetadataFields = Partial<Pick<ExerciseMetaData, "weight" | "reps" | "sets" | "pause">>;
interface AddExerciseMetadataProps {
  exerciseMetadata?: Partial<{ doneExerciseEntries: ExercideDataEntry } & ExerciseMetaData>;
  handleSetMetadata: (data: AddExerciseMetadataFields) => void;
}
export const AddExerciseMetadata = ({ exerciseMetadata, handleSetMetadata }: AddExerciseMetadataProps) => {
  const handleSetNewMetadata = useCallback(
    (data: AddExerciseMetadataFields) => {
      handleSetMetadata({ ...exerciseMetadata, ...data });
    },
    [exerciseMetadata, handleSetMetadata],
  );

  const handleSetWeight = useCallback(
    (weight: string | undefined) => {
      handleSetNewMetadata({ weight });
    },
    [handleSetNewMetadata],
  );

  const handleSetReps = useCallback(
    (reps: string | undefined) => {
      handleSetNewMetadata({ reps });
    },
    [handleSetNewMetadata],
  );

  const handleSetSets = useCallback(
    (sets: string | undefined) => {
      handleSetNewMetadata({ sets });
    },
    [handleSetNewMetadata],
  );
  const handleSetPause = useCallback(
    (pause: string | undefined) => {
      handleSetNewMetadata({ pause });
    },
    [handleSetNewMetadata],
  );

  return (
    <View>
        <TrainingFormControl label="Weight" inputMode="decimal" value={exerciseMetadata?.weight} setValue={handleSetWeight} helper="in kg" />
        <TrainingFormControl label="Number of sets" inputMode="numeric" value={exerciseMetadata?.sets} setValue={handleSetSets} />
        <TrainingFormControl label="Number of repetitions" inputMode="numeric" value={exerciseMetadata?.reps} setValue={handleSetReps} />
        <TrainingFormControl label="Pause duration" inputMode="decimal" value={exerciseMetadata?.pause} setValue={handleSetPause} helper="in minutes" />
    </View>
  );
};
