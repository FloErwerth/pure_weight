import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList, View } from "react-native";
import { PageContent } from "../PageContent/PageContent";
import { HStack } from "../Stack/HStack/HStack";
import { AnimatedView } from "../Themed/AnimatedView/AnimatedView";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";

export type SlidingSwitchOption = { value: string; label: string; Component?: ReactElement };

interface SlidingSwitchProps {
	options: SlidingSwitchOption[];
	onSelectValue: (value: string) => void;
	disabled?: boolean;
	value?: string;
	initialIndex?: number;
}
const HEIGHT = 46;

export function SlidingSwitch({ options, onSelectValue, value, disabled, initialIndex }: SlidingSwitchProps) {
	const [selectedValue, setSelectedValue] = useState<string>(value ?? "");
	const backgroundLeft = useRef(new Animated.Value(0)).current;
	const animatedViewRef = useRef<View>(null);

	const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});

	const selectedValueIndex = useMemo(() => options.findIndex((option) => option.value === selectedValue), [options, selectedValue]);
	const animatedBackgroundStyle = useMemo(
		() => [
			styles.background,
			{
				left: backgroundLeft,
				width: containerSize.width / options.length - 5,
				height: containerSize.height ?? HEIGHT,
			} as const,
		],
		[backgroundLeft, containerSize.width, options.length],
	);
	const flatListRef = useRef<FlatList>(null);
	const measureContainer = useCallback(() => {
		if (animatedViewRef.current) {
			animatedViewRef.current.measure((x, y, width, height) => {
				setContainerSize({ width, height: height - 10 });
			});
		}
	}, []);

	useEffect(() => {
		if (initialIndex !== undefined && initialIndex !== selectedValueIndex) {
			setSelectedValue(options[initialIndex ?? 0].value);
		}
	}, [initialIndex, options, selectedValueIndex]);

	useEffect(() => {
		if (selectedValue && containerSize.width !== 0) {
			if (selectedValueIndex !== -1) {
				const left = selectedValueIndex !== 0 ? (containerSize.width / options.length) * selectedValueIndex - 5 : 0;
				Animated.timing(backgroundLeft, {
					useNativeDriver: false,
					toValue: left,
					duration: !disabled ? 300 : 0,
				}).start();
			}
			if (flatListRef.current) {
				flatListRef.current.scrollToIndex({
					index: selectedValueIndex,
					animated: !disabled,
				});
			}
		}
	}, [containerSize, selectedValue]);

	const handleSelectValue = useCallback(
		(value: string) => {
			setSelectedValue(value);
			onSelectValue(value);
		},
		[onSelectValue],
	);

	const renderItem = useCallback(({ item: { Component } }: { item: { Component?: ReactElement } }) => {
		if (!Component) {
			return null;
		}
		return (
			<PageContent scrollable ghost ignorePadding>
				{Component}
			</PageContent>
		);
	}, []);

	const mappedOptions = useMemo(
		() =>
			options.map(({ label, value }, index) => (
				<ThemedPressable
					disabled={disabled}
					key={label + value + Math.random()}
					ghost
					style={styles.pressable}
					stretch
					onPress={() => handleSelectValue(value)}
				>
					<Text ghost disabled={index !== selectedValueIndex}>
						{label}
					</Text>
				</ThemedPressable>
			)),
		[disabled, handleSelectValue, options],
	);

	return (
		<>
			<ThemedView onLayout={measureContainer} reference={animatedViewRef} style={styles.wrapper}>
				<HStack ghost>{mappedOptions}</HStack>
				<AnimatedView input style={animatedBackgroundStyle} />
			</ThemedView>
			<FlatList
				scrollEnabled={false}
				ref={flatListRef}
				snapToInterval={200}
				snapToOffsets={[0]}
				decelerationRate={0}
				data={options}
				renderItem={renderItem}
				horizontal
			/>
		</>
	);
}
