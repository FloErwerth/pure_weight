import { PropsWithChildren, useMemo } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";
import { ScrollViewProps, StyleProp, ViewProps, ViewStyle } from "react-native";
import { ThemedScrollView } from "../Themed/ThemedScrollView/ThemedScrollView";
import { Text } from "../Themed/ThemedText/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../hooks/useComputedBackgroundColor";

interface BasePageContentProps extends PropsWithChildren, ComputedBackgroundColorProps {
    style?: StyleProp<ViewStyle>;
    titleConfig?: { title: string; size: 24 | 30 };
    stretch?: boolean;
    paddingTop?: number;
    safeBottom?: boolean;
    ignoreGap?: boolean;
    ignorePadding?: boolean;
}
type ScrollablePageContentProps = { scrollable: true } & BasePageContentProps & ScrollViewProps;
type NonScrollablePageContentProps = { scrollable?: false } & BasePageContentProps & ViewProps;

type PageContentProps = ScrollablePageContentProps | NonScrollablePageContentProps;
export const PageContent = (props: PageContentProps) => {
    const { bottom } = useSafeAreaInsets();
    const { children, style, scrollable, titleConfig, stretch, paddingTop, safeBottom, ignoreGap = false, ignorePadding = false } = props;
    const computedBackground = useComputedBackgroundColor(props);

    const titleStyles = useMemo(() => {
        if (!titleConfig) {
            return {};
        }
        return { fontSize: titleConfig.size };
    }, [titleConfig]);

    const wrapperStyles = useMemo(
        () => [
            styles.wrapper,
            style,
            {
                gap: ignoreGap ? 0 : styles.wrapper.gap,
                paddingTop,
                paddingBottom: safeBottom ? bottom : undefined,
                backgroundColor: computedBackground,
                paddingHorizontal: ignorePadding ? 0 : 20,
            },
        ],
        [bottom, computedBackground, ignoreGap, ignorePadding, paddingTop, safeBottom, style],
    );

    const scrollableWrapperStyles = useMemo(() => ({ backgroundColor: computedBackground }), [computedBackground]);

    if (scrollable) {
        return (
            <ThemedScrollView
                keyboardShouldPersistTaps={props.keyboardShouldPersistTaps}
                stretch={stretch}
                background
                style={scrollableWrapperStyles}
                contentContainerStyle={wrapperStyles}>
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
