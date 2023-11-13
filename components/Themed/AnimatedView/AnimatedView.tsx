import { Animated, View, ViewProps } from "react-native";
import { RefObject, useMemo } from "react";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

export interface ThemedViewProps extends ViewProps {
  stretch?: boolean;
  background?: boolean;
  secondary?: boolean;
  ghost?: boolean;
  input?: boolean;
  reference?: RefObject<View>;
}

export const AnimatedView = (props: ThemedViewProps) => {
  const backgroundColor = useComputedBackgroundColor(props);

  const wrapperStyle = useMemo(() => [{ backgroundColor, flex: props.stretch ? 1 : 0 }, props.style], [backgroundColor, props.stretch, props.style]);
  return <Animated.View {...props} ref={props.reference} style={wrapperStyle} />;
};
