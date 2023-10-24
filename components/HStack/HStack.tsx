import { View, ViewProps } from "react-native";
import { styles } from "./styles";
import { useMemo } from "react";

export function HStack(props: ViewProps & { stretch?: boolean }) {
  const wrapperStyles = useMemo(() => ({ ...styles.innerWrapper, flex: props.stretch ? 1 : 0 }), [props.stretch]);
  return <View style={[wrapperStyles, props.style]}>{props.children}</View>;
}
