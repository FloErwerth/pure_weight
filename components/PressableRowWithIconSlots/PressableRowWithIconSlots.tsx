import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ComponentProps, PropsWithChildren, useCallback, useMemo } from "react";
import { Pressable } from "react-native";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";

type IconType = {
	icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
	hide?: boolean;
	size?: number;
	disabled?: boolean;
	onLongPress?: () => void;
	onPress?: () => void;
};

export interface PressableRowWithIconSlotsProps extends PropsWithChildren {
	onClick?: () => void;
	Icon1?: IconType;
	Icon2?: IconType;
	onLongPress?: () => void;
}

export const PressableRowWithIconSlots = ({ children, onClick, Icon1, Icon2, onLongPress }: PressableRowWithIconSlotsProps) => {
	const showIcon1 = useMemo(() => (Icon1 && !Icon1.hide) ?? false, [Icon1]);
	const showIcon2 = useMemo(() => (Icon2 && !Icon2.hide) ?? false, [Icon2]);
	const hasNoIcons = useMemo(() => !showIcon1 && !showIcon2, [showIcon2, showIcon1]);
	const handleClick = useCallback(() => {
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onClick?.();
	}, [onClick]);
	const handleClickIcon1 = useCallback(() => {
		if (Icon1?.onPress) {
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			Icon1.onPress();
		}
	}, [Icon1]);

	const handleClickIcon2 = useCallback(() => {
		if (Icon2?.onPress) {
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			Icon2.onPress();
		}
	}, [Icon2]);
	const handleLongPressIcon1 = useCallback(() => {
		if (Icon1?.onLongPress) {
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			Icon1.onLongPress();
		}
	}, [Icon1]);

	const handleLongPressIcon2 = useCallback(() => {
		if (Icon2?.onLongPress) {
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			Icon2.onLongPress();
		}
	}, [Icon2]);

	const handleLongPress = useCallback(() => {
		if (onLongPress) {
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
			onLongPress();
		}
	}, [onLongPress]);

	return (
		<ThemedView style={[styles.innerWrapper, hasNoIcons && styles.noIconWrapper]}>
			<ThemedPressable stretch delayLongPress={200} onLongPress={handleLongPress} style={styles.buttons} onPress={handleClick}>
				{children}
			</ThemedPressable>
			<HStack style={styles.iconWrapper}>
				{Icon1 && !Icon1?.hide && (
					<Pressable delayLongPress={200} onLongPress={handleLongPressIcon1} disabled={Icon1?.disabled} onPress={handleClickIcon1}>
						<ThemedMaterialCommunityIcons size={Icon1?.size ?? 24} name={Icon1.icon} />
					</Pressable>
				)}
				{Icon2 && !Icon2?.hide && (
					<Pressable delayLongPress={200} onLongPress={handleLongPressIcon2} disabled={Icon2?.disabled} onPress={handleClickIcon2}>
						<ThemedMaterialCommunityIcons size={Icon2?.size ?? 24} name={Icon2.icon} />
					</Pressable>
				)}
			</HStack>
		</ThemedView>
	);
};
