import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { PropsWithChildren } from "react";
import { NewLine } from "../App/help/NewLine";
import { styles } from "./styles";

export const Paragraph = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView ghost>
            <Text ghost>
                {children} <NewLine numberOfLines={1} />
            </Text>
        </ThemedView>
    );
};

export const Li = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView ghost style={styles.marginBottom}>
            <Text ghost>
                {"\u2022"} {children}
            </Text>
        </ThemedView>
    );
};

export const HTwo = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView ghost style={styles.marginVerticalLarge}>
            <Text ghost style={styles.title}>
                {children}
            </Text>
        </ThemedView>
    );
};

export const HThree = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView ghost style={styles.marginVertical}>
            <Text ghost style={styles.text}>
                {children}
            </Text>
        </ThemedView>
    );
};
