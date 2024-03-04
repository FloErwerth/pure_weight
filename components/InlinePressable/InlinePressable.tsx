import { PropsWithChildren } from "react";
import { Text } from "../Themed/ThemedText/Text";

interface InlinePressableProps extends PropsWithChildren {
    handlePress: () => void;
}
const style = { fontSize: 24 };
export const InlinePressable = ({ children, handlePress }: InlinePressableProps) => {
    return (
        <Text style={style} link onPress={handlePress} input>
            {children}
        </Text>
    );
};
