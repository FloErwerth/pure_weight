import { TextInput, TextInputProps } from "react-native";
import * as React from "react";
import { RefObject, useCallback, useMemo } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { useTheme } from "../../../theme/context";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { styles } from "./styles";
import { cleanError } from "../../../store/reducers/errors";
import { getErrorByKey } from "../../../store/reducers/errors/errorSelectors";
import { ErrorText } from "../../ErrorText/ErrorText";
import { ErrorFields } from "../../../store/reducers/errors/types";
import { borderRadius } from "../../../theme/border";

interface ThemedTextInputProps extends TextInputProps, ComputedBackgroundColorProps {
    reference?: RefObject<TextInput>;
    hideErrorBorder?: boolean;
    stretch?: boolean;
    bottomSheet?: boolean;
    suffix?: string;
    showClear?: boolean;
    height?: number;
    errorKey?: ErrorFields;
    round?: boolean;
    padding?: boolean;
}

export const ThemedTextInput = ({ padding = true, ...props }: ThemedTextInputProps) => {
    const backgroundColor = useComputedBackgroundColor(props);
    const { editable = true } = props;
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state, props?.errorKey));
    const { mainColor, textDisabled, errorColor, secondaryColor } = useTheme();
    const dispatch = useAppDispatch();

    const handleTextInput = useCallback(
        (value: string) => {
            if (hasError && props?.errorKey) {
                dispatch(cleanError([props?.errorKey]));
            }
            props.onChangeText?.(value);
        },
        [hasError, props, dispatch],
    );

    const placeholderColor = useMemo(() => {
        if (hasError) {
            return errorColor;
        }
        if (!editable) {
            return textDisabled;
        }
        if (props.placeholderTextColor !== undefined) {
            return props.placeholderTextColor;
        }
        return secondaryColor;
    }, [editable, errorColor, hasError, props.placeholderTextColor, secondaryColor, textDisabled]);

    const textInputStyle = useMemo(() => {
        const baseStyle = [
            {
                padding: padding ? 10 : undefined,
                flex: props.stretch ? 1 : undefined,
                backgroundColor,
                color: editable ? mainColor : textDisabled,
                borderRadius: props.round ? borderRadius : undefined,
            } as const,
            styles.base,
            props.style,
        ];
        const errorStyle = hasError
            ? { color: errorColor, borderWidth: props.hideErrorBorder ? 0 : 1, borderColor: errorColor }
            : {};
        return [errorStyle, baseStyle];
    }, [
        backgroundColor,
        editable,
        errorColor,
        hasError,
        mainColor,
        props.hideErrorBorder,
        padding,
        props.round,
        props.stretch,
        props.style,
        textDisabled,
    ]);

    return (
        <>
            {props.bottomSheet ? (
                <BottomSheetTextInput
                    {...props}
                    clearButtonMode={props.showClear ? "while-editing" : "never"}
                    onChangeText={handleTextInput}
                    returnKeyType="done"
                    style={textInputStyle}
                    placeholderTextColor={placeholderColor}
                />
            ) : (
                <TextInput
                    {...props}
                    returnKeyType="done"
                    clearButtonMode={props.showClear ? "while-editing" : "never"}
                    ref={props.reference}
                    onChangeText={handleTextInput}
                    style={textInputStyle}
                    placeholderTextColor={placeholderColor}
                />
            )}
            {hasError && props?.errorKey && <ErrorText errorKey={props.errorKey} />}
        </>
    );
};
