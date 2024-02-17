import { Animated, NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps } from "react-native";
import * as React from "react";
import { RefObject, useCallback, useMemo, useRef } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { useTheme } from "../../../theme/context";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { styles } from "./styles";
import { cleanError } from "../../../store/reducers/errors";
import { getErrorByKey } from "../../../store/reducers/errors/errorSelectors";
import { ErrorText } from "../../ErrorText/ErrorText";
import { ErrorFields } from "../../../store/reducers/errors/types";
import { Text } from "../ThemedText/Text";

interface ThemedTextInputProps extends TextInputProps, ComputedBackgroundColorProps {
    reference?: RefObject<TextInput>;
    hideErrorBorder?: boolean;
    stretch?: boolean;
    bottomSheet?: boolean;
    suffix?: string;
    showClear?: boolean;
    height?: number;
    errorKey?: ErrorFields;
}

export const ThemedTextInput = (props: ThemedTextInputProps) => {
    const backgroundColor = useComputedBackgroundColor(props);
    const { editable = true } = props;
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state, props?.errorKey));
    const { mainColor, textDisabled, errorColor, secondaryColor } = useTheme();
    const dispatch = useAppDispatch();
    const opacity = useRef(new Animated.Value(0)).current;

    const handleTextInput = useCallback(
        (value: string) => {
            if (hasError && props?.errorKey) {
                dispatch(cleanError([props?.errorKey]));
            }
            props.onChangeText?.(value);
        },
        [hasError, props, dispatch],
    );

    const handleFocus = useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            props.onFocus?.(e);
            if (props.suffix) {
                Animated.timing(opacity, {
                    duration: 200,
                    useNativeDriver: false,
                    toValue: 0,
                }).start();
            }
        },
        [opacity, props],
    );

    const handleBlur = useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            props.onBlur?.(e);
            if (props.suffix) {
                Animated.timing(opacity, {
                    duration: 200,
                    useNativeDriver: false,
                    toValue: 0,
                }).start();
            }
        },
        [opacity, props],
    );

    const placeholderColor = useMemo(() => {
        if (hasError) {
            return errorColor;
        }
        if (!editable) {
            return textDisabled;
        }
        return secondaryColor;
    }, [editable, errorColor, hasError, secondaryColor, textDisabled]);

    const textInputStyle = useMemo(() => {
        const baseStyle = [
            {
                flex: props.stretch ? 1 : 0,
                backgroundColor,
                color: editable ? mainColor : textDisabled,
            } as const,
            styles.base,
            props.style,
        ];
        if (!hasError) {
            return baseStyle;
        }
        const errorStyle = { color: errorColor, borderWidth: props.hideErrorBorder ? 0 : 1, borderColor: errorColor };
        return [errorStyle, baseStyle];
    }, [backgroundColor, editable, errorColor, hasError, mainColor, props.hideErrorBorder, props.stretch, props.style, textDisabled]);

    return (
        <>
            {props.bottomSheet ? (
                <BottomSheetTextInput
                    {...props}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    clearButtonMode={props.showClear ? "while-editing" : "never"}
                    onChangeText={handleTextInput}
                    returnKeyType="done"
                    style={textInputStyle}
                    placeholderTextColor={placeholderColor}
                />
            ) : (
                <TextInput
                    {...props}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    returnKeyType="done"
                    clearButtonMode={props.showClear ? "while-editing" : "never"}
                    ref={props.reference}
                    onChangeText={handleTextInput}
                    style={textInputStyle}
                    placeholderTextColor={placeholderColor}
                />
            )}
            {hasError && props?.errorKey ? <ErrorText errorKey={props.errorKey} /> : <Text ghost />}
        </>
    );
};
