import { TextInput, TextInputProps } from "react-native";
import { componentBackgroundColor, mainColor, placeholderErrorColor, secondaryColor } from "../App/theme/colors";
import * as React from "react";
import { RefObject, useCallback } from "react";
import { AppState, ErrorFields } from "../../store/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { getErrorByKey } from "../../store/selectors";
import { styles } from "./styles";
import { cleanError } from "../../store/reducer";

interface ThemedTextInputProps extends TextInputProps {
  ref?: RefObject<TextInput>;
  errorKey?: ErrorFields;
  hideErrorBorder?: boolean;
}
export const ThemedTextInput = (props: ThemedTextInputProps) => {
  const getHasError = useAppSelector((state: AppState) => getErrorByKey(state)(props.errorKey));

  const dispatch = useAppDispatch();
  const handleTextInput = useCallback(
    (value: string) => {
      if (getHasError && props.errorKey) {
        dispatch(cleanError([props.errorKey]));
      }
      props.onChangeText?.(value);
    },
    [dispatch, getHasError, props],
  );

  return (
    <TextInput
      {...props}
      onChangeText={handleTextInput}
      style={[
        { backgroundColor: componentBackgroundColor, color: mainColor, marginHorizontal: props.clearButtonMode !== "never" ? 10 : 0 },
        props.style,
        !props.hideErrorBorder && getHasError && styles.errorBorder,
        getHasError && styles.error,
      ]}
      placeholderTextColor={getHasError ? placeholderErrorColor : secondaryColor}
    />
  );
};
