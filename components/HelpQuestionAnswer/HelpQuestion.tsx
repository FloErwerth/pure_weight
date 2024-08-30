import { PropsWithChildren, useMemo } from "react";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";

interface QuestionProps {
	question: string;
	title: string;
	onPress: () => void;
	shown: boolean;
}
export const HelpQuestion = ({ question, onPress, shown }: QuestionProps) => {
	const wrapperStyles = useMemo(
		() => ({ opacity: shown ? 1 : 0, height: shown ? "auto" : 0, padding: shown ? 12 : 0, marginBottom: shown ? 10 : 0 }) as const,
		[shown],
	);
	return (
		<ThemedPressable hideBorder style={wrapperStyles} round onPress={onPress}>
			<Text stretch ghost style={styles.question}>
				{question}
			</Text>
		</ThemedPressable>
	);
};

export const HelpAnswer = ({ children }: PropsWithChildren) => {
	return (
		<ThemedView style={styles.answerWrapper} ghost>
			{children}
		</ThemedView>
	);
};
