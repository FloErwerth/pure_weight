import { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../../hooks/useComputedBackgroundColor";
import { PropsWithChildren, useMemo } from "react";

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
