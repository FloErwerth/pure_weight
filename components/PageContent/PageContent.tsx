import { PropsWithChildren, useMemo } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";
import { StyleProp, ViewStyle } from "react-native";
import { ThemedScrollView } from "../Themed/ThemedScrollView/ThemedScrollView";
import { Text } from "../Themed/ThemedText/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageContentProps extends PropsWithChildren {
    style?: StyleProp<ViewStyle>;
    scrollable?: boolean;
    titleConfig?: { title: string; size: number };
    stretch?: boolean;
    paddingTop?: number;
    safeBottom?: boolean;
}
export const PageContent = ({ children, style, scrollable, titleConfig, stretch, paddingTop, safeBottom }: PageContentProps) => {
    const { bottom } = useSafeAreaInsets();
    const titleStyles = useMemo(() => {
        if (!titleConfig) {
            return {};
        }
        return { fontSize: titleConfig.size };
    }, [titleConfig]);
    const wrapperStyles = useMemo(() => [styles.wrapper, style, { paddingTop, paddingBottom: safeBottom ? bottom : undefined }], [bottom, paddingTop, safeBottom, style]);

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
        <ThemedView stretch={stretch} background style={wrapperStyles}>
            {titleConfig && (
                <Text style={titleStyles} ghost>
                    {titleConfig.title}
                </Text>
            )}
            {children}
        </ThemedView>
    );
};
