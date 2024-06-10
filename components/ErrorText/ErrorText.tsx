import { Text } from "../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTypedTranslation } from "../../locales/i18next";
import { ErrorFields } from "../../store/reducers/errors/types";
import { toErrorTranslation } from "../../store/mapper/error";

type ErrorTextProps = {
    errorKey?: ErrorFields;
    children?: string;
};

//todo: map error field to translation if necessary

export const ErrorText = ({ errorKey, children }: ErrorTextProps) => {
    const { t } = useTypedTranslation();
    const internalErrorText = useMemo(() => children || t(toErrorTranslation(errorKey)), [children, errorKey, t]);

    return (
        <Text ghost error style={styles.text}>
            {internalErrorText}
        </Text>
    );
};
