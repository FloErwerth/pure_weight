import { VStack } from "../../../../Stack/VStack/VStack";
import { Appearance, Pressable } from "react-native";
import { HStack } from "../../../../Stack/HStack/HStack";
import { styles } from "./styles";
import { Text } from "../../../../Themed/ThemedText/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProfileContent } from "../SettingsSection/ProfileSection";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../theme/context";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { getThemeKey } from "../../../../../store/selectors";
import { useCallback, useMemo, useState } from "react";
import * as Haptics from "expo-haptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { setTheme } from "../../../../../store/reducer";
import { ThemeKey } from "../../../../../theme/types";

export const ThemeSelection = () => {
  const { t } = useTranslation();
  const { secondaryColor, componentBackgroundColor, primaryColor } = useTheme();
  const [usesDeviceTheme, setUsesDeviceTheme] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useAppSelector(getThemeKey);

  const handleSelectLanguage = useCallback(
    (themeKey: ThemeKey | "device") => {
      if (themeKey === "device") {
        dispatch(setTheme(Appearance.getColorScheme() || "dark"));
        setUsesDeviceTheme(true);
        return;
      }
      setUsesDeviceTheme(false);
      dispatch(setTheme(themeKey));
      void Haptics.impactAsync(ImpactFeedbackStyle.Light);
    },
    [dispatch],
  );
  const stackStyles = useMemo(() => [styles.vStack, { backgroundColor: componentBackgroundColor }], [componentBackgroundColor]);
  const getStyles = useCallback((selected: boolean) => [styles.innerWrapper, selected && { borderColor: secondaryColor }, { backgroundColor: primaryColor }], [primaryColor, secondaryColor]);

  return (
    <ProfileContent title={t("settings_theme")}>
      <VStack style={stackStyles}>
        <Pressable onPress={() => handleSelectLanguage("light")} style={getStyles(!usesDeviceTheme && theme === "light")}>
          <HStack ghost style={styles.innerStack}>
            <Text ghost style={styles.text}>
              {t("theme_light")}
            </Text>
            {!usesDeviceTheme && theme === "light" && <MaterialCommunityIcons name="check" size={24} color={secondaryColor} />}
          </HStack>
        </Pressable>
        <Pressable onPress={() => handleSelectLanguage("dark")} style={getStyles(!usesDeviceTheme && theme === "dark")}>
          <HStack ghost style={styles.innerStack}>
            <Text ghost style={styles.text}>
              {t("theme_dark")}
            </Text>
            {!usesDeviceTheme && theme === "dark" && <MaterialCommunityIcons name="check" size={24} color={secondaryColor} />}
          </HStack>
        </Pressable>
        <Pressable onPress={() => handleSelectLanguage("device")} style={getStyles(usesDeviceTheme)}>
          <HStack ghost style={styles.innerStack}>
            <Text ghost style={styles.text}>
              {t("theme_device")}
            </Text>
            {usesDeviceTheme && <MaterialCommunityIcons name="check" size={24} color={secondaryColor} />}
          </HStack>
        </Pressable>
      </VStack>
    </ProfileContent>
  );
};
