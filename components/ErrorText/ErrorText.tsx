import { useMemo } from "react";
import { useTypedTranslation } from "../../locales/i18next";
import { toErrorTranslation } from "../../store/mapper/error";
import { ErrorFields } from "../../store/reducers/errors/types";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";

type ErrorTextProps = {
	errorKey?: ErrorFields;
	children?: string;
};

export const ErrorText = ({ errorKey, children }: ErrorTextProps) => {
	const { t } = useTypedTranslation();
	const internalErrorText = useMemo(() => children || t(toErrorTranslation(errorKey)), [children, errorKey, t]);

	return (
		<Text ghost error style={styles.text}>
			{internalErrorText}
		</Text>
	);
};
