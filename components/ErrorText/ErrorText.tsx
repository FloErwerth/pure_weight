import { Text } from "../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ErrorFields } from "../../store/reducers/errors/types";

type ErrorTextProps = {
    errorKey?: ErrorFields;
    children?: string;
};
export const ErrorText = ({ errorKey, children }: ErrorTextProps) => {
    const { t } = useTranslation();
    const internalErrorText = useMemo(() => children || t(`error_${errorKey ?? ""}`), [children, errorKey, t]);

    return (
        <Text ghost error>
            {internalErrorText}
        </Text>
    );
};
