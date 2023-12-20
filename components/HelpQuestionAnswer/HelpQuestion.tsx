import { PropsWithChildren } from "react";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { styles } from "./styles";
import { ThemedView } from "../Themed/ThemedView/View";

interface QuestionProps {
    question: string;
    title: string;
    onPress: () => void;
}
export const HelpQuestion = ({ question, onPress }: QuestionProps) => (
    <ThemedPressable input style={styles.wrapper} onPress={onPress}>
        <Text ghost style={styles.question}>
            {question}
        </Text>
    </ThemedPressable>
);

export const HelpAnswer = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView stretch style={styles.answerWrapper} ghost>
            {children}
        </ThemedView>
    );
};
