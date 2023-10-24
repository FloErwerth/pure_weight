import { HStack } from "../HStack/HStack";
import { PlainExerciseData } from "../../store/types";
import { useMemo } from "react";
import { styles } from "./styles";
import { useAppSelector } from "../../store";
import { getSetIndex } from "../../store/selectors";
import { useTranslation } from "react-i18next";
import { Text } from "../Themed/ThemedText/Text";
import { useTheme } from "../../theme/context";

interface DoneSetDisplayRowProps {
  setNumber?: number | string;
  setData?: PlainExerciseData;
}
export const DoneSetDisplayRow = ({ setData, setNumber }: DoneSetDisplayRowProps) => {
  const { mainColor, secondaryColor, inputFieldBackgroundColor } = useTheme();
  const currentSetIndex = useAppSelector(getSetIndex);
  const { t } = useTranslation();
  const highlight = useMemo(() => {
    if (typeof setNumber === "number") {
      return currentSetIndex === setNumber - 1;
    }
    return false;
  }, [currentSetIndex, setNumber]);
  const highlightWrapperStyles = useMemo(() => ({ backgroundColor: highlight ? inputFieldBackgroundColor : "transparent" }), [highlight, inputFieldBackgroundColor]);

  return (
    <HStack style={[styles.innerWrapper, highlightWrapperStyles]}>
      <Text style={{ textAlign: "center", alignSelf: "stretch", flex: 0.85, color: highlight ? mainColor : secondaryColor, fontSize: 16 }}>{setNumber ?? "#"}</Text>
      <Text style={{ textAlign: "center", flex: 1, color: highlight ? mainColor : secondaryColor, fontSize: 16 }}>{setData?.weight ?? t("training_header_weight")}</Text>
      <Text style={{ textAlign: "center", flex: 1, color: highlight ? mainColor : secondaryColor, fontSize: 16 }}>{setData?.reps ?? t("training_header_reps")}</Text>
    </HStack>
  );
};
