import { HStack } from "../../../Stack/HStack/HStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { ComponentProps, FunctionComponent, useCallback, useMemo } from "react";
import { styles } from "./styles";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { SvgProps } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { View } from "react-native";
import { useTypedTranslation } from "../../../../locales/i18next";
import { TranslationKeys } from "../../../../locales/translationKeys";

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
    selected: boolean;
    onSelect: () => void;
    titleKey: TranslationKeys;
    prependedExtraContent?: Icon | SvgType;
    appendedExtraContent?: Icon | SvgType;
    stretch?: boolean;
    center?: boolean;
    hint?: {
        text: string;
        size: number;
    };
};

export function SelectableSetting({ appendedExtraContent, prependedExtraContent, onSelect, selected, titleKey, stretch, center, hint }: SelectableSettingProps) {
    const { t } = useTypedTranslation();
    const wrapperStyles = useMemo(() => [styles.innerWrapper, stretch && { flex: 1 }], [stretch]);
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
            return <View style={styles.checkboxCompensation}>{selected && <ThemedMaterialCommunityIcons name="check" ghost size={26} />}</View>;
        }
        if (appendedExtraContent && "name" in appendedExtraContent) {
            return <ThemedMaterialCommunityIcons color={appendedExtraContent.color} ghost name={appendedExtraContent.name} size={appendedExtraContent.size} />;
        }
        return <appendedExtraContent.Svg width={appendedExtraContent?.size ?? 24} height={appendedExtraContent?.size ?? 24} />;
    }, [appendedExtraContent, selected]);
    const hintStyle = useMemo(() => ({ fontSize: hint ? hint.size : 0 }), [hint]);

    const handleSelect = useCallback(() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect();
    }, [onSelect]);

    return (
        <ThemedPressable onPress={handleSelect} style={wrapperStyles}>
            <HStack style={styles.outerStack}>
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
