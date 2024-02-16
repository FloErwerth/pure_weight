import { Text } from "../Themed/ThemedText/Text";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { ErrorFields } from "../../store/reducers/errors/errorFields";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export type ErrorTextPosition = "TOP" | "BOTTOM";

type ErrorTextProps = {
    position?: ErrorTextPosition;
    errorKey?: ErrorFields;
};
export const ErrorText = ({ errorKey, position = "TOP" }: ErrorTextProps) => {
    const { t } = useTranslation();

    const errorText = useMemo(() => t(`error_${errorKey ?? ""}`), [errorKey, t]);

    const wrapperStyle = useMemo(() => {
        if (position === "TOP") {
            return { marginBottom: 5 };
        }
        return { marginTop: 5 };
    }, [position]);

    return (
        <Animated.View style={wrapperStyle} layout={Layout} entering={FadeIn} exiting={FadeOut}>
            <Text ghost error>
                {errorText}
            </Text>
        </Animated.View>
    );
};
