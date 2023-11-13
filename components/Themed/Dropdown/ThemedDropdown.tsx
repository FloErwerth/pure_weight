import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "./styles";
import { AppState, ErrorFields } from "../../../store/types";
import { Keyboard, Pressable, View } from "react-native";
import { ThemedPressable } from "../Pressable/Pressable";
import { ThemedView } from "../ThemedView/View";
import { Text } from "../ThemedText/Text";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { borderRadius } from "../../../theme/border";
import { useTheme } from "../../../theme/context";
import { useAppSelector } from "../../../store";
import { getErrorByKey } from "../../../store/selectors";

interface ThemedDropdownProps<T extends readonly string[]> {
  isSelectable?: boolean;
  onSelectItem: (value: T[number]) => void;
  placeholderTranslationKey?: string;
  value?: T[number];
  options: T;
  errorKey: ErrorFields;
}

interface ItemProps<T extends string> {
  value: T;
  onSelectItem: (value: T) => void;
}

function Separator({ show }: { show: boolean }) {
  const { backgroundColor } = useTheme();

  if (!show) {
    return null;
  }

  return <View style={{ height: 1, backgroundColor: backgroundColor }} />;
}
function Item<T extends string>({ value, onSelectItem }: ItemProps<T>) {
  return (
    <Pressable key={value} onPress={() => onSelectItem(value)}>
      <Text style={styles.item}>{value}</Text>
    </Pressable>
  );
}

export function ThemedDropdown<T extends readonly string[]>({ isSelectable, errorKey, options, onSelectItem, placeholderTranslationKey = "select_item", value }: ThemedDropdownProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<View>(null);
  const [containerMeasures, setContainerMeasures] = useState<{ width: number; height: number }>({ width: 100, height: 50 });
  const error = useAppSelector((state: AppState) => getErrorByKey(state)(errorKey));

  const togglePicker = useCallback(() => setOpen((open) => !open), []);
  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height) => {
        setContainerMeasures({ width, height: height + 5 });
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      Keyboard.dismiss();
    }
  }, [open]);

  const dropdownStyles = useMemo(() => [styles.dropdown, { width: containerMeasures.width, top: containerMeasures.height }], [containerMeasures]);

  const handleSelectItem = useCallback(
    (value: T[number]) => {
      setOpen(false);
      onSelectItem(value);
    },
    [onSelectItem],
  );

  return (
    <ThemedView ghost style={styles.wrapper}>
      <ThemedPressable error={error} disabled={!isSelectable} input reference={containerRef} onLayout={measureContainer} style={styles.selectedItemWrapper} onPress={togglePicker}>
        <Text ghost disabled={!isSelectable} error={error} style={styles.selectedItem}>
          {value ?? t(placeholderTranslationKey)}
        </Text>
      </ThemedPressable>
      {open && (
        <Animated.View style={dropdownStyles} layout={Layout} entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
          <ThemedView input style={{ borderRadius }}>
            {options.map((value, index) => (
              <>
                <Item key={value} onSelectItem={handleSelectItem} value={value} />
                <Separator show={index < options.length - 1} />
              </>
            ))}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}
