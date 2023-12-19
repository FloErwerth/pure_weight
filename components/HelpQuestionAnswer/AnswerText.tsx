import { PropsWithChildren } from "react";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { ThemedView } from "../Themed/ThemedView/View";

export const AnswerText = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView ghost>
            <Text ghost style={styles.answer}>
                {children}
            </Text>
        </ThemedView>
    );
};
