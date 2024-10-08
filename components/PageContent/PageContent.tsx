import { PropsWithChildren, useMemo } from "react";
import { ScrollViewProps, StyleProp, ViewProps, ViewStyle } from "react-native";
import DeviceInfo from "react-native-device-info";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../hooks/useComputedBackgroundColor";
import { borderRadius } from "../../theme/border";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";

interface BasePageContentProps extends PropsWithChildren, ComputedBackgroundColorProps {
	style?: StyleProp<ViewStyle>;
	titleConfig?: { title: string; size: 24 | 30 };
	stretch?: boolean;
	paddingTop?: number;
	safeBottom?: boolean;
	ignoreGap?: boolean;
	ignorePadding?: boolean;
	round?: boolean;
}

type ScrollablePageContentProps = { scrollable?: true } & BasePageContentProps & ScrollViewProps;
type NonScrollablePageContentProps = { scrollable?: false } & BasePageContentProps & ViewProps;

type PageContentProps = ScrollablePageContentProps | NonScrollablePageContentProps;
export const PageContent = (props: PageContentProps) => {
	const { bottom } = useSafeAreaInsets();
	const safeBottomPixels = bottom === 0 && DeviceInfo.isTablet() ? 20 : bottom;

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
				borderRadius: props.round ? borderRadius : 0,
				gap: ignoreGap ? 0 : styles.wrapper.gap,
				paddingTop,
				paddingBottom: safeBottom ? safeBottomPixels : undefined,
				backgroundColor: computedBackground,
				paddingHorizontal: ignorePadding ? 0 : 20,
				flex: stretch ? 1 : undefined,
			},
			style,
		],
		[computedBackground, ignoreGap, ignorePadding, paddingTop, props.round, safeBottom, safeBottomPixels, stretch, style],
	);

	const scrollableWrapperStyles = useMemo(() => ({ backgroundColor: computedBackground, flex: stretch ? 1 : 0 }), [computedBackground, stretch]);

	if (scrollable) {
		return (
			<KeyboardAwareScrollView
				showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
				horizontal={false}
				keyboardShouldPersistTaps={props.keyboardShouldPersistTaps}
				style={scrollableWrapperStyles}
				keyboardOpeningTime={100}
				contentContainerStyle={wrapperStyles}
			>
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
