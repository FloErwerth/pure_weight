import { SvgProps } from "react-native-svg";
import { mainColor, mainDisabledColor, secondaryColor } from "../../theme/colors";
import { useAppSelector } from "../../../store";
import { getTrainingIndex } from "../../../store/selectors";
import { useMemo } from "react";

export const TabBarIcon = ({ focused, Icon }: { focused: boolean; Icon: React.FC<SvgProps> }) => {
  const trainingIndex = useAppSelector(getTrainingIndex);
  const fillColor = useMemo(() => {
    if (trainingIndex !== undefined) {
      return mainDisabledColor;
    } else {
      return focused ? mainColor : secondaryColor;
    }
  }, [focused, trainingIndex]);
  return <Icon width={16} height={16} fill={fillColor} />;
};
