import { PropsWithChildren } from "react";
import { Text } from "../Themed/ThemedText/Text";

interface InlinePressableProps extends PropsWithChildren {
    handlePress: () => void;
}
export const InlinePressable = ({ children, handlePress }: InlinePressableProps) => {
    return (
        <Text link onPress={handlePress} input>
            {children}
        </Text>
    );
};
