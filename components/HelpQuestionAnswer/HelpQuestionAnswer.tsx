import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import { ReactNode } from "react";
import { Text } from "../Themed/ThemedText/Text";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { styles } from "./styles";
import { ThemedView } from "../Themed/ThemedView/View";

interface QuestionAnswerProps {
    question: string;
    title: string;
    answer: ReactNode;
}
export const HelpQuestionAnswer = ({ question, answer, title }: QuestionAnswerProps) => {
    const [ref, open] = useBottomSheetRef();

    return (
        <ThemedPressable style={styles.wrapper} onPress={open}>
            <Text style={styles.question}>{question}</Text>
            <ThemedBottomSheetModal title={title} ref={ref}>
                <ThemedView stretch style={styles.answerWrapper} input>
                    {answer}
                </ThemedView>
            </ThemedBottomSheetModal>
        </ThemedPressable>
    );
};
