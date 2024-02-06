import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { ThemedView } from "../Themed/ThemedView/View";
import { useTranslation } from "react-i18next";
import { SearchbarProps } from "./types";
import { useMemo } from "react";

export const Searchbar = ({ handleSetSearchManual }: SearchbarProps) => {
    const { t } = useTranslation();
    const placeholder = useMemo(() => t("settings_search_placeholder"), [t]);

    return (
        <ThemedView input round>
            <HStack padding style={{ gap: 10, alignItems: "center" }} ghost>
                <ThemedMaterialCommunityIcons name="magnify" ghost size={30} />
                <ThemedTextInput showClear onChangeText={handleSetSearchManual} placeholder={placeholder} stretch />
            </HStack>
        </ThemedView>
    );
};
