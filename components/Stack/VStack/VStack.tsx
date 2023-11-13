import { styles } from "./styles";
import { useMemo } from "react";
import { ThemedView, ThemedViewProps } from "../../Themed/ThemedView/View";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

interface HStackProps extends ThemedViewProps {
  background?: boolean;
}

export function VStack(props: HStackProps) {
  const backgroundColor = useComputedBackgroundColor(props);

  const style = useMemo(() => [styles.innerWrapper, { backgroundColor }], [backgroundColor]);

  return (
    <ThemedView {...props} style={[style, props.style]}>
      {props.children}
    </ThemedView>
  );
}
