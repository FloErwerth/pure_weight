import { useAppDispatch, useAppSelector } from "../../store";
import { getTrainingDayData } from "../../store/selectors";
import MissingData from "../../media/icons/MissingData.svg";
import { useNavigate } from "../../hooks/navigate";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { PressableRowWithIconSlots } from "../../components/PressableRowWithIconSlots/PressableRowWithIconSlots";
import { styles } from "../../components/App/progress/styles";
import React, { useCallback } from "react";
import { setTrainingDayIndex } from "../../store/reducer";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { borderRadius } from "../../theme/border";
import { PageContent } from "../../components/PageContent/PageContent";
import { View } from "react-native";
import { Text } from "../../components/Themed/ThemedText/Text";

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
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", borderRadius }}>
            <MissingData fill="#444" />
            <Text style={{ fontSize: 16 }}>{t("progress_placeholder")}</Text>
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
