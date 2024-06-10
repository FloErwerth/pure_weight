import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ThemedTextInput } from "../Themed/ThemedTextInput/ThemedTextInput";
import { SearchbarProps } from "./types";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

export const Searchbar = ({ handleSetSearchManual }: SearchbarProps) => {
    const { t } = useTypedTranslation();
    const placeholder = useMemo(() => t(TranslationKeys.SETTINGS_SEARCH_PLACEHOLDER), [t]);

    return (
        <HStack style={styles.searchbarWrapper} ghost>
            <ThemedTextInput round showClear onChangeText={handleSetSearchManual} placeholder={placeholder} stretch />
            <ThemedMaterialCommunityIcons name="magnify" ghost size={30} />
        </HStack>
    );
};
