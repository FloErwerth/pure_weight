import { PropsWithChildren, useMemo } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";
import { ScrollViewProps, StyleProp, ViewProps, ViewStyle } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../hooks/useComputedBackgroundColor";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
            {
                gap: ignoreGap ? 0 : styles.wrapper.gap,
                paddingTop,
                paddingBottom: safeBottom ? bottom : undefined,
                backgroundColor: computedBackground,
                paddingHorizontal: ignorePadding ? 0 : 20,
                flex: stretch ? 1 : undefined,
            },
            style,
        ],
        [bottom, computedBackground, ignoreGap, ignorePadding, paddingTop, safeBottom, stretch, style],
    );

    const scrollableWrapperStyles = useMemo(
        () => ({ backgroundColor: computedBackground, flex: stretch ? 1 : 0 }),
        [computedBackground, stretch],
    );

    if (scrollable) {
        return (
            <KeyboardAwareScrollView
                horizontal={false}
                keyboardShouldPersistTaps={props.keyboardShouldPersistTaps}
                style={scrollableWrapperStyles}
                keyboardOpeningTime={100}
                contentContainerStyle={wrapperStyles}>
                {titleConfig && (
                    <Text style={titleStyles} ghost>
                        {titleConfig.title}
                    </Text>
                )}
                {children}
            </KeyboardAwareScrollView>
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
