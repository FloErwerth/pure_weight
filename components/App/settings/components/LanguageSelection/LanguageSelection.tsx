import { SettingsSection } from "../SettingsSection/SettingsSection";
import { Pressable } from "react-native";
import { HStack } from "../../../../HStack/HStack";
import GermanFlag from "../../../../../media/icons/GermanFlag.svg";
import { Text } from "../../../../Text/Text";
import UsaFlag from "../../../../../media/icons/UsaFlag.svg";
import { VStack } from "../../../../VStack/VStack";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { styles } from "./styles";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setLanguage } from "../../../../../store/reducer";
import { getLanguage } from "../../../../../store/selectors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { secondaryColor } from "../../../theme/colors";
import * as Haptics from "expo-haptics";
import { ImpactFeedbackStyle } from "expo-haptics";

export const LanguageSelection = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const german = useMemo(() => t("german"), [t]);
  const english = useMemo(() => t("english"), [t]);
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

  return (
    <SettingsSection title={t("settings_language")}>
      <VStack style={styles.vStack}>
        <Pressable onPress={() => handleSelectLanguage("de")} style={[styles.innerWrapper, isGerman ? styles.selectedWrapper : undefined]}>
          <HStack style={styles.outerStack}>
            <HStack style={styles.innerStack}>
              <GermanFlag width={30} height={30} />
              <Text style={styles.text}>{german}</Text>
            </HStack>
            {isGerman && <MaterialCommunityIcons name="check" size={30} color={secondaryColor} />}
          </HStack>
        </Pressable>
        <Pressable onPress={() => handleSelectLanguage("en")} style={[styles.innerWrapper, !isGerman ? styles.selectedWrapper : undefined]}>
          <HStack style={styles.outerStack}>
            <HStack style={styles.innerStack}>
              <UsaFlag width={30} height={30} />
              <Text style={styles.text}>{english}</Text>
            </HStack>
            {!isGerman && <MaterialCommunityIcons name="check" size={30} color={secondaryColor} />}
          </HStack>
        </Pressable>
      </VStack>
    </SettingsSection>
  );
};
