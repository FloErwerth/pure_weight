import { useAppDispatch, useAppSelector } from "../../store";
import { getTrainingDayData } from "../../store/selectors";
import { Text, View } from "react-native";
import MissingData from "../../media/icons/MissingData.svg";
import { secondaryColor, secondaryComponentBackgroundColor } from "../../components/App/theme/colors";
import { useNavigate } from "../../hooks/navigate";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PressableRowWithIconSlots } from "../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { styles } from "../../components/App/progress/styles";
import { useCallback } from "react";
import { setTrainingDayIndex } from "../../store/reducer";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/View/View";
import { borderRadius } from "../../components/App/theme/border";
import { PageContent } from "../../components/PageContent/PageContent";

export function Progress() {
  const data = useAppSelector(getTrainingDayData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectTrainingDayToShow = useCallback(
    (dayIndex: number) => {
      dispatch(setTrainingDayIndex(dayIndex));
      navigate("chart");
    },
    [dispatch, navigate],
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SiteNavigationButtons title={t("progress")} />
      <PageContent>
        {data.length === 0 && (
          <View style={{ flex: 1, justifyContent: "center", backgroundColor: "black", alignItems: "center", borderRadius }}>
            <MissingData fill={secondaryComponentBackgroundColor} />
            <Text style={{ color: secondaryColor, textAlign: "center", fontSize: 16 }}>{t("progress_placeholder")}</Text>
          </View>
        )}
        {data.length > 0 && (
          <View style={{ flex: 1, gap: 10 }}>
            {data.map(({ name }, index) => (
              <PressableRowWithIconSlots key={`${name}${index}`} onClick={() => selectTrainingDayToShow(index)}>
                <Text style={styles.trainingDayName}>{name}</Text>
              </PressableRowWithIconSlots>
            ))}
          </View>
        )}
      </PageContent>
    </ThemedView>
  );
}
