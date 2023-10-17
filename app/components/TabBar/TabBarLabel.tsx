import { useAppSelector } from "../../../store";
import { getTrainingIndex } from "../../../store/selectors";
import { useMemo } from "react";
import { mainColor, mainDisabledColor, secondaryColor } from "../../theme/colors";
import { Text } from "../../../components/Text/Text";

export const TabBarLabel = ({ focused, title }: { focused: boolean; title: string }) => {
  const trainingIndex = useAppSelector(getTrainingIndex);
  const color = useMemo(() => {
    if (trainingIndex !== undefined) {
      return mainDisabledColor;
    } else {
      return focused ? mainColor : secondaryColor;
    }
  }, [focused, trainingIndex]);
  return <Text style={{ color, alignSelf: "center" }}>{title}</Text>;
};
