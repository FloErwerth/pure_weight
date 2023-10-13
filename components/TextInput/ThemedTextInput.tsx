import { TextInput, TextInputProps } from "react-native";
import { componentBackgroundColor, mainColor, secondaryColor } from "../../app/theme/colors";
import * as React from "react";
import { RefObject } from "react";

export const ThemedTextInput = (props: TextInputProps & { ref?: RefObject<TextInput> }) => {
  return <TextInput {...props} style={[{ backgroundColor: componentBackgroundColor, color: mainColor }, props.style]} placeholderTextColor={secondaryColor} />;
};
