import { ScrollView, Text, View } from "react-native";
import { ReactNode, useCallback, useState } from "react";
import { PressableRowWithIconSlots } from "../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { useNavigate } from "../utils/navigate";
import { Routes } from "../types/routes";
import { useAppDispatch, useAppSelector } from "../store";
import { getSavedTrainings } from "../store/selectors";
import { removeTrainingDay, setSelectedDay } from "../store/reducer";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AlertModal } from "../components/AlertModal/AlertModal";
import { HStack } from "../components/HStack/HStack";
import { Button } from "../components/Button/Button";
import { mainColor } from "./theme/colors";
import { SafeAreaView } from "../components/SafeAreaView/SafeAreaView";

export default function Main() {
  const navigate = useNavigate();

  const [Alert, setAlert] = useState<ReactNode | null>(null);

  const dispatch = useAppDispatch();
  const savedTrainings = useAppSelector(getSavedTrainings);

  const handleNavigateToCreateTraining = useCallback(() => {
    navigate(Routes.CREATE_TRAINING);
  }, [navigate]);

  const handleNavigateToTrain = useCallback(
    (index: number) => {
      dispatch(setSelectedDay(index));
      navigate(Routes.TRAIN);
    },
    [dispatch, navigate],
  );

  const handlePress = useCallback(() => {
    dispatch(setSelectedDay(undefined));
    handleNavigateToCreateTraining();
  }, [dispatch, handleNavigateToCreateTraining]);

  const handleDelete = useCallback((index: number) => dispatch(removeTrainingDay(index)), [dispatch]);
  const handleShowAlert = useCallback(
    (index: number) => setAlert(<AlertModal onCancel={() => setAlert(null)} onConfirm={() => handleDelete(index)} title="Delete training?" content="This action can't be undone" isVisible={true} />),
    [handleDelete],
  );
  const handleEdit = useCallback(
    (index: number) => {
      dispatch(setSelectedDay(index));
      handleNavigateToCreateTraining();
    },
    [dispatch, handleNavigateToCreateTraining],
  );
  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.center}>
        <View style={styles.stack}>
          <HStack style={styles.titleWrapper}>
            <Text style={styles.title}>Workouts</Text>
            <View>
              <Button theme="ghost" onPress={handlePress} style={{ button: styles.button }}>
                <MaterialCommunityIcons color={mainColor} size={40} name="plus" />
              </Button>
            </View>
          </HStack>
          <ScrollView style={styles.view}>
            <View style={styles.savedTrainings}>
              {savedTrainings.map((trainingDay, index) => (
                <PressableRowWithIconSlots
                  key={trainingDay.name.concat("-key").concat(index.toString())}
                  onClick={() => handleNavigateToTrain(index)}
                  Icon2={{ icon: "pencil", onPress: () => handleEdit(index) }}
                  Icon1={{ icon: "delete", onPress: () => handleShowAlert(index) }}
                >
                  <Text style={styles.trainingDayName}>{trainingDay.name}</Text>
                </PressableRowWithIconSlots>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      {Alert}
    </SafeAreaView>
  );
}
