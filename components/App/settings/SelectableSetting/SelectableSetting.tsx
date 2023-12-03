import { HStack } from "../../../Stack/HStack/HStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { ComponentProps, FunctionComponent, useCallback, useMemo } from "react";
import { styles } from "./styles";
import { useTheme } from "../../../../theme/context";
import { useTranslation } from "react-i18next";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { SvgProps } from "react-native-svg";

export type Icon = {
    name: ComponentProps<typeof MaterialCommunityIcons>["name"];
    size: number;
    color?: string;
};
export type SvgType = {
    Svg: FunctionComponent<SvgProps>;
    size: number;
};
type SelectableSettingProps = {
    icon?: Icon;
    svg?: SvgType;
    selected: boolean;
    onSelect: () => void;
    titleKey: string;
};
export function SelectableSetting({ svg, icon, onSelect, selected, titleKey }: SelectableSettingProps) {
    const { secondaryColor } = useTheme();
    const { t } = useTranslation();

    const wrapperStyles = useMemo(() => [styles.innerWrapper, selected && { borderColor: secondaryColor }], [secondaryColor, selected]);
    const RenderedExtraContent = useCallback(() => {
        if ((icon && svg) || icon) {
            return <ThemedMaterialCommunityIcons color={icon.color} ghost name={icon.name} size={icon.size} />;
        } else if (svg) {
            return <svg.Svg width={svg?.size ?? 24} height={svg?.size ?? 24} />;
        }
    }, [icon, svg]);

    return (
        <ThemedPressable input onPress={onSelect} style={wrapperStyles}>
            <HStack input style={styles.outerStack}>
                <RenderedExtraContent />
                <HStack stretch ghost style={styles.innerStack}>
                    <Text ghost style={styles.text}>
                        {t(titleKey)}
                    </Text>
                    {selected && <MaterialCommunityIcons name="check" size={24} color={secondaryColor} />}
                </HStack>
            </HStack>
        </ThemedPressable>
    );
}
