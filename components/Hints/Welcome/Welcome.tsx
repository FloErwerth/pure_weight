import { Modal } from "../../Modal/Modal";
import { VStack } from "../../VStack/VStack";
import { Text, View } from "react-native";
import { componentBackgroundColor, mainColor } from "../../../app/theme/colors";
import { HStack } from "../../HStack/HStack";
import { borderRadius } from "../../../app/theme/border";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "../../Button/Button";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getIsFirstTimeRendered } from "../../../store/selectors";
import { useCallback, useEffect, useState } from "react";
import { setFirstTimeRendered } from "../../../store/reducer";

export const Welcome = () => {
  const isFirstTimeRendered = useAppSelector(getIsFirstTimeRendered);
  const [renderModal, setRenderModal] = useState(false);
  const dispatch = useAppDispatch();
  const handleConfirmInitialModal = useCallback(() => {
    dispatch(setFirstTimeRendered(false));
  }, [dispatch]);

  useEffect(() => {
    if (isFirstTimeRendered) {
      setTimeout(() => setRenderModal(true), 150);
    }
  }, [isFirstTimeRendered]);

  return (
    <>
      {isFirstTimeRendered && (
        <Modal isVisible={renderModal}>
          <VStack style={{ gap: 15 }}>
            <Text style={{ fontSize: 26, textAlign: "center", color: mainColor }}>Welcome to Pure Weight</Text>
            <HStack style={{ backgroundColor: componentBackgroundColor, borderRadius, padding: 10, alignItems: "center", gap: 5 }}>
              <MaterialCommunityIcons name="weight" color={mainColor} size={20} />
              <Text style={{ paddingRight: 15, fontSize: 16, paddingLeft: 10, color: mainColor }}>This app is designed to track weights as simple as possible</Text>
            </HStack>
            <HStack style={{ backgroundColor: componentBackgroundColor, borderRadius, padding: 10, alignItems: "center", gap: 5 }}>
              <MaterialCommunityIcons name="content-save-off" color={mainColor} size={20} />
              <Text style={{ paddingRight: 15, fontSize: 16, paddingLeft: 10, color: mainColor }}>Your data is stored only on your phone and will not be send to any server</Text>
            </HStack>
            <HStack style={{ backgroundColor: componentBackgroundColor, borderRadius, padding: 10, alignItems: "center", gap: 5 }}>
              <MaterialCommunityIcons name="help-box" color={mainColor} size={20} />
              <Text style={{ paddingRight: 15, fontSize: 16, paddingLeft: 10, color: mainColor }}>Feel free to contact me to give feedback to features or witnessing a bug</Text>
            </HStack>
            <View>
              <Text style={{ fontSize: 16, textAlign: "center", color: mainColor }}>
                To create your first workout press the <MaterialCommunityIcons name="plus" color={mainColor} size={20} /> on the top right of the screen
              </Text>
            </View>
            <Button onPress={handleConfirmInitialModal} title="Got it!"></Button>
          </VStack>
        </Modal>
      )}
    </>
  );
};
