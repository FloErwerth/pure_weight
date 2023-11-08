import { TextInput, TextInputProps } from "react-native";
import * as React from "react";
import { RefObject, useCallback, useMemo } from "react";
import { AppState, ErrorFields } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getErrorByKey } from "../../../store/selectors";
import { cleanError } from "../../../store/reducer";
import { useTheme } from "../../../theme/context";

interface ThemedTextInputProps extends TextInputProps {
  reference?: RefObject<TextInput>;
  errorKey?: ErrorFields;
  hideErrorBorder?: boolean;
  stretch?: boolean;
}
export const ThemedTextInput = (props: ThemedTextInputProps) => {
  const { editable = true } = props;
  const getHasError = useAppSelector((state: AppState) => getErrorByKey(state)(props.errorKey));
  const { mainColor, textDisabled, inputFieldBackgroundColor, errorColor, secondaryErrorColor, secondaryColor } = useTheme();

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
  const placeholderColor = useMemo(() => {
    if (getHasError) {
      return secondaryErrorColor;
    }
    return secondaryColor;
  }, [getHasError, secondaryColor, secondaryErrorColor]);
  const textInputStyle = useMemo(() => {
    const baseStyle = [
      { flex: props.stretch ? 1 : 0, backgroundColor: inputFieldBackgroundColor, color: editable ? mainColor : textDisabled, marginHorizontal: props.clearButtonMode !== "never" ? 10 : 0 },
      props.style,
    ];
    if (!getHasError) {
      return baseStyle;
    }
    const errorStyle = { color: errorColor, borderWidth: props.hideErrorBorder ? 0 : 1, borderColor: errorColor };
    return [errorStyle, baseStyle];
  }, [editable, errorColor, getHasError, inputFieldBackgroundColor, mainColor, props.clearButtonMode, props.hideErrorBorder, props.stretch, props.style, textDisabled]);

  return <TextInput {...props} ref={props.reference} onChangeText={handleTextInput} style={textInputStyle} placeholderTextColor={placeholderColor} />;
};
