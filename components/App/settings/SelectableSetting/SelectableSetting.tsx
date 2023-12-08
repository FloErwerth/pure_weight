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
    prependedExtraContent?: Icon | SvgType;
    appendedExtraContent?: Icon | SvgType;
    selected: boolean;
    onSelect: () => void;
    titleKey: string;
    stretch?: boolean;
    center?: boolean;
    hint?: {
        text: string;
        size: number;
    };
};
export function SelectableSetting({ appendedExtraContent, prependedExtraContent, onSelect, selected, titleKey, stretch, center, hint }: SelectableSettingProps) {
    const { secondaryColor } = useTheme();
    const { t } = useTranslation();

    const wrapperStyles = useMemo(() => [styles.innerWrapper, selected && { borderColor: secondaryColor }, stretch && { flex: 1 }], [secondaryColor, selected, stretch]);
    const textStyles = useMemo(() => [styles.text, center && ({ textAlign: "center" } as const)], [center]);
    const PrependedExtraContent = useCallback(() => {
        if (!prependedExtraContent) {
            return null;
        }
        if (prependedExtraContent && "name" in prependedExtraContent) {
            return <ThemedMaterialCommunityIcons color={prependedExtraContent.color} ghost name={prependedExtraContent.name} size={prependedExtraContent.size} />;
        }
        return <prependedExtraContent.Svg width={prependedExtraContent?.size ?? 24} height={prependedExtraContent?.size ?? 24} />;
    }, [prependedExtraContent]);
    const AppendedExtraContent = useCallback(() => {
        if (!appendedExtraContent) {
            return <>{selected && <MaterialCommunityIcons name="check" size={24} color={secondaryColor} />}</>;
        }
        if (appendedExtraContent && "name" in appendedExtraContent) {
            return <ThemedMaterialCommunityIcons color={appendedExtraContent.color} ghost name={appendedExtraContent.name} size={appendedExtraContent.size} />;
        }
        return <appendedExtraContent.Svg width={appendedExtraContent?.size ?? 24} height={appendedExtraContent?.size ?? 24} />;
    }, [appendedExtraContent, secondaryColor, selected]);
    const hintStyle = useMemo(() => ({ fontSize: hint ? hint.size : 0 }), [hint]);
    return (
        <ThemedPressable input onPress={onSelect} style={wrapperStyles}>
            <HStack input style={styles.outerStack}>
                <PrependedExtraContent />
                <HStack stretch ghost style={styles.innerStack}>
                    <Text ghost stretch style={textStyles}>
                        {t(titleKey)}
                    </Text>
                    <AppendedExtraContent />
                </HStack>
            </HStack>
            {hint && (
                <Text warning ghost style={hintStyle}>
                    {hint?.text}
                </Text>
            )}
        </ThemedPressable>
    );
}
