import { TextInput, TextInputProps } from "react-native";
import { componentBackgroundColor, mainColor, mainDisabledColor } from "../../app/theme/colors";
import * as React from "react";
import { RefObject } from "react";

export const ThemedTextInput = (props: React.Component<TextInputProps>["props"] & { ref?: RefObject<TextInput> }) => {
  return <TextInput {...props} style={{ backgroundColor: componentBackgroundColor, color: mainColor }} placeholderTextColor={mainDisabledColor} />;
};