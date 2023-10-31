import { trainStyles } from "../trainStyles";
import { HStack } from "../../../HStack/HStack";
import { ExerciseMetaDataDisplay } from "../ExerciseMetaDataDisplay/ExerciseMetaDataDisplay";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { Pressable, ScrollView, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PreviousTraining } from "../../../PreviousTraining/PreviousTraining";
import { ExerciseMetaData, PlainExerciseData } from "../../../../store/types";
import { useCallback, useMemo, useState } from "react";
import { AddNoteModal } from "../../../AddNoteModal/AddNoteModal";
import { useTheme } from "../../../../theme/context";
import { borderRadius } from "../../../../theme/border";
import { TrainingHeader } from "../TrainingHeader/TrainingHeader";
import { SetInputRow } from "../../../SetInputRow/SetInputRow";
import * as Haptics from "expo-haptics";
import { useAppSelector } from "../../../../store";
import { getSpecificMetaDataRaw, getSpecificNumberOfSets } from "../../../../store/selectors";

interface Exercise {
  metaData: ExerciseMetaData;
  exerciseIndex: number;
  onSetDone: (exerciseIndex: number, setIndex: number, data: PlainExerciseData) => void;
}
const useGeneratedSetData = (exerciseIndex: number) => {
  const getNumberOfSets = useAppSelector(getSpecificNumberOfSets);
  const getMetaData = useAppSelector(getSpecificMetaDataRaw);
  const metaData = useMemo(() => getMetaData(exerciseIndex), [exerciseIndex, getMetaData]);
  const numberOfSets = useMemo(() => getNumberOfSets(exerciseIndex), [exerciseIndex, getNumberOfSets]);

  const generatedSets = useMemo(() => {
    const map = new Map<number, PlainExerciseData & { filled: boolean }>();
    Array(numberOfSets)
      .fill(undefined)
      .forEach((_, index) => {
        map.set(index, { ...metaData, filled: false });
      });
    return map;
  }, [metaData, numberOfSets]);
  return useState(generatedSets);
};

export const Exercise = ({ metaData, exerciseIndex, onSetDone }: Exercise) => {
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const showEditNoteModalTitleStyle = useMemo(() => ({ padding: 10, paddingHorizontal: 15, alignSelf: "center" }) as const, []);
  const { mainColor, componentBackgroundColor } = useTheme();
  const [note, setNote] = useState<string | undefined>(undefined);
  const handleCloseEditNoteModal = useCallback(() => setShowEditNoteModal(false), []);
  const [doneSets, setDoneSets] = useGeneratedSetData(exerciseIndex);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  const handleCancelEditNoteModal = useCallback(() => {
    setNote(undefined);
    handleCloseEditNoteModal();
  }, [handleCloseEditNoteModal]);

  const handleShowEditNoteModal = useCallback(() => {
    setShowEditNoteModal(true);
  }, []);

  const handleSetDone = useCallback(
    (data: PlainExerciseData, index: number) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newIndex = currentSetIndex + 1;
      setCurrentSetIndex(newIndex);
      setActiveSetIndex(newIndex);
      const newDoneSets = new Map(doneSets.entries());
      newDoneSets.set(index, { ...data, filled: true });
      setDoneSets(newDoneSets);
      onSetDone(exerciseIndex, index, data);
    },
    [currentSetIndex, doneSets, exerciseIndex, onSetDone, setDoneSets],
  );

  const mappedDoneSets = useMemo(
    () =>
      Array.from(doneSets.values()).map((exerciseMetadata, index) => ({
        data: exerciseMetadata,
        editable: doneSets.get(index)?.filled || index === currentSetIndex,
        hasData: Boolean(doneSets.get(index)?.filled),
        onSetDone: (plainExerciseData: PlainExerciseData) => handleSetDone(plainExerciseData, index),
        key: index * Math.random(),
      })),
    [currentSetIndex, doneSets, handleSetDone],
  );

  return (
    <View key={metaData.name.length * Math.random() * 10} style={trainStyles.carouselWrapper}>
      <HStack style={trainStyles.headerWrapper}>
        <ExerciseMetaDataDisplay exerciseMetaData={metaData} exerciseIndex={exerciseIndex} />
        <ThemedView component style={trainStyles.noteButtonWrapper}>
          <Pressable style={showEditNoteModalTitleStyle} onPress={handleShowEditNoteModal}>
            <MaterialCommunityIcons name="note-edit-outline" color={mainColor} size={30} />
          </Pressable>
        </ThemedView>
      </HStack>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={trainStyles.innerWrapper}>
        <ThemedView style={{ paddingTop: 15, paddingBottom: 10, borderRadius, backgroundColor: componentBackgroundColor }}>
          <TrainingHeader />
          {mappedDoneSets.map(({ data, editable, hasData, onSetDone, key }, index) => {
            return <SetInputRow key={key} isActiveSet={activeSetIndex === index} data={data} isEditable={editable} hasData={hasData} onSetDone={onSetDone} setIndex={index + 1} />;
          })}
        </ThemedView>
        <PreviousTraining activeSetIndex={activeSetIndex} exerciseIndex={exerciseIndex} />
      </ScrollView>
      {showEditNoteModal && <AddNoteModal onConfirm={handleCloseEditNoteModal} setNote={handleCloseEditNoteModal} note={note} onCancel={handleCancelEditNoteModal} showModal={showEditNoteModal} />}
    </View>
  );
};
