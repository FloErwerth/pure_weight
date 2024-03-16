import { ThemedView } from "../Themed/ThemedView/View";
import { Text } from "../Themed/ThemedText/Text";
import { PropsWithChildren } from "react";
import { NewLine } from "../App/help/NewLine";

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
        <ThemedView ghost style={{ marginBottom: 10 }}>
            <Text ghost>
                {"\u2022"} {children}
            </Text>
        </ThemedView>
    );
};

export const HTwo = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView ghost style={{ marginVertical: 20 }}>
            <Text ghost style={{ fontSize: 40 }}>
                {children}
            </Text>
        </ThemedView>
    );
};

export const HThree = ({ children }: PropsWithChildren) => {
    return (
        <ThemedView ghost style={{ marginVertical: 10 }}>
            <Text ghost style={{ fontSize: 28 }}>
                {children}
            </Text>
        </ThemedView>
    );
};
