import { PropsWithChildren, useMemo } from "react";
import { Text } from "../Themed/ThemedText/Text";

interface InlinePressableProps extends PropsWithChildren {
    handlePress: () => void;
    cta?: boolean;
    textSize?: number;
}
export const InlinePressable = ({ children, handlePress, cta, textSize = 24 }: InlinePressableProps) => {
    const style = useMemo(() => ({ fontSize: textSize }), [textSize]);
    return (
        <Text cta={cta} ghost={cta} style={style} link={!cta} onPress={handlePress}>
            {children}
        </Text>
    );
};
