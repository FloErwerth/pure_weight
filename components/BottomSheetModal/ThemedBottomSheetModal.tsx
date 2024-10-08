import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { forwardRef, PropsWithChildren, ReactNode, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, ViewStyle } from "react-native";
import DeviceInfo from "react-native-device-info";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/context";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";

export type SnapPoint = `${number}%`;
export interface ThemedBottomSheetModalProps extends PropsWithChildren {
	title?: string | ReactNode;
	customContentStyle?: ViewStyle;
	hideIndicator?: boolean;
	style?: ViewStyle;
	onRequestClose?: () => void;
	allowSwipeDownToClose?: boolean;
	dismissOnClose?: boolean;
	snapPoints?: SnapPoint[];
	animationDuration?: number;
	titleSize?: number;
}

const refs: RefObject<BottomSheetModal>[] = [];
export const useBottomSheetRef = () => {
	const ref = useRef<BottomSheetModal>(null);
	const [isOpen, setIsOpen] = useState(false);
	const openBottomSheet = useCallback(() => {
		setIsOpen(true);
		Keyboard.dismiss();
		ref.current?.present();
	}, []);

	const closeBottomSheet = useCallback(() => {
		setIsOpen(false);
		ref.current?.close();
	}, []);

	const closeAll = useCallback(() => {
		for (let i = 0; i < refs.length; i++) {
			ref.current?.close();
		}
		setIsOpen(false);
	}, []);

	useEffect(() => {
		refs.push(ref);
		return () => {
			refs.splice(refs.indexOf(ref), 1);
		};
	}, []);

	return useMemo(() => ({ ref, openBottomSheet, closeBottomSheet, closeAll, isOpen }), [closeAll, closeBottomSheet, isOpen, openBottomSheet]);
};

const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop opacity={0.8} appearsOnIndex={0} disappearsOnIndex={-1} {...props} />;

export const ThemedBottomSheetModal = forwardRef<BottomSheetModal, ThemedBottomSheetModalProps>(
	(
		{ dismissOnClose, hideIndicator, customContentStyle, animationDuration, snapPoints, children, title, onRequestClose, allowSwipeDownToClose = true },
		ref,
	) => {
		const { mainColor, inputFieldBackgroundColor } = useTheme();
		const { top, bottom } = useSafeAreaInsets();
		const defaultStyle = useMemo(
			() => [customContentStyle, styles.defaultContentStyle, { backgroundColor: inputFieldBackgroundColor }],
			[customContentStyle, inputFieldBackgroundColor],
		);

		const animationConfig = useMemo(() => ({ duration: animationDuration || 225 }), [animationDuration]);

		const customIndicator = useMemo(
			() => ({ backgroundColor: allowSwipeDownToClose && !hideIndicator ? mainColor : "transparent" }),
			[allowSwipeDownToClose, hideIndicator, mainColor],
		);
		const contentStyle = useMemo(() => ({ paddingBottom: (DeviceInfo.isTablet() && bottom === 0 ? 20 : bottom) * 2 }), [bottom]);
		const contentContainerStyle = useMemo(() => ({ flex: snapPoints ? 1 : 0 }), [snapPoints]);

		const Title = useCallback(() => {
			if (title) {
				return (
					<Text input style={styles.title}>
						{title}
					</Text>
				);
			}
			return null;
		}, [title]);

		return (
			<BottomSheetModal
				enablePanDownToClose={allowSwipeDownToClose}
				index={0}
				handleIndicatorStyle={customIndicator}
				enableDynamicSizing
				backdropComponent={renderBackdrop}
				backgroundStyle={defaultStyle}
				enableDismissOnClose={dismissOnClose}
				onDismiss={onRequestClose}
				ref={ref}
				animationConfigs={animationConfig}
				stackBehavior="push"
				topInset={top}
				snapPoints={snapPoints}
				keyboardBehavior="extend"
			>
				<BottomSheetScrollView contentContainerStyle={contentContainerStyle}>
					<ThemedView ghost style={styles.wrapper}>
						<Title />
					</ThemedView>
					<ThemedView ghost stretch style={contentStyle}>
						{children}
					</ThemedView>
				</BottomSheetScrollView>
			</BottomSheetModal>
		);
	},
);
