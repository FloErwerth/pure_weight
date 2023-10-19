import { useAppDispatch, useAppSelector } from "../../store";
import { getTrainingDayData } from "../../store/selectors";
import { Text, View } from "react-native";
import MissingData from "../../media/icons/MissingData.svg";
import { secondaryColor } from "../../components/App/theme/colors";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PressableRowWithIconSlots } from "../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { styles } from "../../components/App/progress/styles";
import { useCallback } from "react";
import { setTrainingDayIndex } from "../../store/reducer";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/View/View";

export default function Index() {
  const data = useAppSelector(getTrainingDayData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectTrainingDayToShow = useCallback(
    (dayIndex: number) => {
      dispatch(setTrainingDayIndex(dayIndex));
      navigate(Routes.PROGRESS_CHART);
    },
    [dispatch, navigate],
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons handleBack={() => navigate(Routes.HOME)} title={t("progress")} />
      {data.length === 0 && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <MissingData fill={secondaryColor} />
          <Text style={{ color: secondaryColor, fontSize: 16 }}>{t("progress_placeholder")}</Text>
        </View>
      )}
      {data.length > 0 && (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
          {data.map(({ name }, index) => (
            <PressableRowWithIconSlots key={`${name}${index}`} onClick={() => selectTrainingDayToShow(index)}>
              <Text style={styles.trainingDayName}>{name}</Text>
            </PressableRowWithIconSlots>
          ))}
        </View>
      )}
    </ThemedView>
  );
}
