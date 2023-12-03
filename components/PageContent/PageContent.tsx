import { PropsWithChildren } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { styles } from "./styles";
import { StyleProp, ViewStyle } from "react-native";
import { ThemedScrollView } from "../Themed/ThemedScrollView/ThemedScrollView";

interface PageContentProps extends PropsWithChildren {
    style?: StyleProp<ViewStyle>;
    scrollable?: boolean;
}
export const PageContent = ({ children, style, scrollable }: PageContentProps) => {
    if (scrollable) {
        return (
            <ThemedScrollView background contentContainerStyle={[styles.wrapper, style]}>
                {children}
            </ThemedScrollView>
        );
    }

    return (
        <ThemedView stretch background style={[styles.wrapper, style]}>
            {children}
        </ThemedView>
    );
};
