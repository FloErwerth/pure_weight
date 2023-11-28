import { Animated, TextInput, TextInputProps } from "react-native";
import * as React from "react";
import { RefObject, useCallback, useMemo, useRef } from "react";
import { AppState, useAppDispatch, useAppSelector } from "../../../store";
import { useTheme } from "../../../theme/context";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { styles } from "./styles";
import { cleanError, ErrorFields } from "../../../store/reducers/errors";
import { getErrorByKey } from "../../../store/reducers/errors/errorSelectors";

interface ThemedTextInputProps extends TextInputProps, ComputedBackgroundColorProps {
    reference?: RefObject<TextInput>;
    errorKey?: ErrorFields;
    hideErrorBorder?: boolean;
    stretch?: boolean;
    bottomSheet?: boolean;
    suffix?: string;
    showClear?: boolean;
    height?: number;
}
export const ThemedTextInput = (props: ThemedTextInputProps) => {
    const backgroundColor = useComputedBackgroundColor(props);
    const { editable = true } = props;
    const getHasError = useAppSelector((state: AppState) => getErrorByKey(state)(props.errorKey));
    const { mainColor, textDisabled, errorColor, secondaryColor } = useTheme();
    const dispatch = useAppDispatch();
    const opacity = useRef(new Animated.Value(0)).current;

    const handleTextInput = useCallback(
        (value: string) => {
            if (getHasError && props.errorKey) {
                dispatch(cleanError([props.errorKey]));
            }
            props.onChangeText?.(value);
        },
        [dispatch, getHasError, props],
    );

    const handleFocus = useCallback(() => {
        if (props.suffix) {
            Animated.timing(opacity, {
                duration: 200,
                useNativeDriver: false,
                toValue: 0,
            }).start();
        }
    }, [opacity, props.suffix]);

    const handleBlur = useCallback(() => {
        if (props.suffix) {
            Animated.timing(opacity, {
                duration: 200,
                useNativeDriver: false,
                toValue: 0,
            }).start();
        }
    }, [opacity, props.suffix]);

    const placeholderColor = useMemo(() => {
        if (getHasError) {
            return errorColor;
        }
        if (!editable) {
            return textDisabled;
        }
        return secondaryColor;
    }, [editable, errorColor, getHasError, secondaryColor, textDisabled]);

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
        if (!getHasError) {
            return baseStyle;
        }
        const errorStyle = { color: errorColor, borderWidth: props.hideErrorBorder ? 0 : 1, borderColor: errorColor };
        return [errorStyle, baseStyle];
    }, [backgroundColor, editable, errorColor, getHasError, mainColor, props.hideErrorBorder, props.stretch, props.style, textDisabled]);

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
                ></BottomSheetTextInput>
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
        </>
    );
};
