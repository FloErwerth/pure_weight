import { useTheme } from "../../theme/context";
import { useMemo } from "react";
import { styles } from "./styles";
import { Text, View } from "react-native";

type ChipType = "Info" | "Eyecatcher" | "Warning" | "Error";
type ChipProps = {
    type: ChipType;
    title: string;
};

const useChipColor = (type: ChipType) => {
    const { warningColor, errorColor, successColor, mainColor } = useTheme();
    switch (type) {
        case "Eyecatcher":
            return { backgroundColor: successColor, color: "black" };
        case "Error":
            return { backgroundColor: errorColor, color: mainColor };
        case "Info":
            return { backgroundColor: mainColor, color: "black" };
        case "Warning":
            return { backgroundColor: warningColor, color: "black" };
    }
};
export const Chip = ({ type, title }: ChipProps) => {
    const { backgroundColor, color } = useChipColor(type);
    const chipStyles = useMemo(() => [styles.chip, { backgroundColor, color }], []);

    return (
        <View style={chipStyles}>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
};
