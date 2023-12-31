import { PropsWithChildren, useMemo } from "react";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { styles } from "./styles";
import { ThemedView } from "../Themed/ThemedView/View";

interface QuestionProps {
    question: string;
    title: string;
    onPress: () => void;
    shown: boolean;
}
export const HelpQuestion = ({ question, onPress, shown }: QuestionProps) => {
    const wrapperStyles = useMemo(() => ({ opacity: shown ? 1 : 0, height: shown ? "auto" : 0, padding: shown ? 10 : 0, marginBottom: shown ? 10 : 0 }) as const, [shown]);
    return (
        <ThemedPressable hideBorder input style={wrapperStyles} round onPress={onPress}>
            <Text ghost style={styles.question}>
                {question}
            </Text>
        </ThemedPressable>
    );
};

export const HelpAnswer = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView stretch style={styles.answerWrapper} ghost>
            {children}
        </ThemedView>
    );
};
