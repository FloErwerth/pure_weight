import { PropsWithChildren, useMemo } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";
import { StyleProp, ViewStyle } from "react-native";
import { ThemedScrollView } from "../Themed/ThemedScrollView/ThemedScrollView";
import { Text } from "../Themed/ThemedText/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../hooks/useComputedBackgroundColor";

interface PageContentProps extends PropsWithChildren, ComputedBackgroundColorProps {
    style?: StyleProp<ViewStyle>;
    scrollable?: boolean;
    titleConfig?: { title: string; size: 24 | 30 };
    stretch?: boolean;
    paddingTop?: number;
    safeBottom?: boolean;
    ignoreGap?: boolean;
}
export const PageContent = (props: PageContentProps) => {
    const { bottom } = useSafeAreaInsets();
    const { children, style, scrollable, titleConfig, stretch, paddingTop, safeBottom, ignoreGap = false } = props;
    const computedBackground = useComputedBackgroundColor(props);

    const titleStyles = useMemo(() => {
        if (!titleConfig) {
            return {};
        }
        return { fontSize: titleConfig.size };
    }, [titleConfig]);

    const wrapperStyles = useMemo(
        () => [styles.wrapper, style, { gap: ignoreGap ? 0 : styles.wrapper.gap, paddingTop, paddingBottom: safeBottom ? bottom : undefined, backgroundColor: computedBackground }],
        [bottom, computedBackground, ignoreGap, paddingTop, safeBottom, style],
    );

    if (scrollable) {
        return (
            <ThemedScrollView stretch={stretch} background contentContainerStyle={wrapperStyles}>
                {titleConfig && (
                    <Text style={titleStyles} ghost>
                        {titleConfig.title}
                    </Text>
                )}
                {children}
            </ThemedScrollView>
        );
    }

    return (
        <ThemedView stretch={stretch} style={wrapperStyles}>
            {titleConfig && (
                <Text style={titleStyles} ghost>
                    {titleConfig.title}
                </Text>
            )}
            {children}
        </ThemedView>
    );
};
