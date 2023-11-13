import { ProfileContent } from "../SettingsSection/ProfileSection";
import { Pressable } from "react-native";
import { HStack } from "../../../../Stack/HStack/HStack";
import GermanFlag from "../../../../../media/icons/GermanFlag.svg";
import { Text } from "../../../../Themed/ThemedText/Text";
import UsaFlag from "../../../../../media/icons/UsaFlag.svg";
import { VStack } from "../../../../Stack/VStack/VStack";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setLanguage } from "../../../../../store/reducer";
import { getLanguage } from "../../../../../store/selectors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { useTheme } from "../../../../../theme/context";

export const LanguageSelection = () => {
  const { t, i18n } = useTranslation();
  const { secondaryColor, componentBackgroundColor, primaryColor } = useTheme();

  const dispatch = useAppDispatch();
  const lang = useAppSelector(getLanguage);
  const isGerman = useMemo(() => lang === "de", [lang]);

  const handleSelectLanguage = useCallback(
    (language: "en" | "de") => {
      void Haptics.impactAsync(ImpactFeedbackStyle.Light);
      i18n.changeLanguage(language);
      dispatch(setLanguage(language));
    },
    [dispatch, i18n],
  );
  const stackStyles = useMemo(() => [styles.vStack, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
  const getStyles = useCallback((isGerman: boolean) => [styles.innerWrapper, isGerman && { borderColor: secondaryColor }, { backgroundColor: primaryColor }], [primaryColor, secondaryColor]);
  return (
    <ProfileContent title={t("settings_language")}>
      <VStack style={stackStyles}>
        <Pressable onPress={() => handleSelectLanguage("de")} style={getStyles(isGerman)}>
          <HStack style={styles.outerStack}>
            <HStack style={styles.innerStack}>
              <GermanFlag width={24} height={24} />
              <Text style={styles.text}>Deutsch</Text>
            </HStack>
            {isGerman && <MaterialCommunityIcons name="check" size={24} color={secondaryColor} />}
          </HStack>
        </Pressable>
        <Pressable onPress={() => handleSelectLanguage("en")} style={getStyles(!isGerman)}>
          <HStack style={styles.outerStack}>
            <HStack style={styles.innerStack}>
              <UsaFlag width={24} height={24} />
              <Text style={styles.text}>English</Text>
            </HStack>
            {!isGerman && <MaterialCommunityIcons name="check" size={24} color={secondaryColor} />}
          </HStack>
        </Pressable>
      </VStack>
    </ProfileContent>
  );
};
