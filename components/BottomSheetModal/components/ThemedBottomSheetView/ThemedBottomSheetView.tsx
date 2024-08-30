import { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types";
import { PropsWithChildren, useMemo } from "react";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../../hooks/useComputedBackgroundColor";

interface ThemedBottomSheetViewProps extends BottomSheetViewProps, ComputedBackgroundColorProps {
	children: PropsWithChildren["children"];
}
export const ThemedBottomSheetView = (props: ThemedBottomSheetViewProps) => {
	const backgroundColor = useComputedBackgroundColor(props);
	const style = useMemo(() => [props.style, { backgroundColor }], [backgroundColor, props.style]);

	return (
		<BottomSheetView {...props} style={style}>
			{props.children}
		</BottomSheetView>
	);
};
