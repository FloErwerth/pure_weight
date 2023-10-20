import {Animated,LayoutAnimation, Pressable, View} from "react-native";
import {ThemedTextInput} from "../TextInput/ThemedTextInput";
import {borderRadius} from "../App/theme/border";
import {HStack} from "../HStack/HStack";
import {
    componentBackgroundColor, mainColor,
    primaryColor,
} from "../App/theme/colors";
import {Button} from "../Button/Button";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Modal, ModalProps} from "../Modal/Modal";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Measurement} from "../../app/profile/measurements";
import DateTimePicker from '@react-native-community/datetimepicker';
import {getDateTodayIso} from "../../utils/date";
import {useAppSelector} from "../../store";
import {getLanguage} from "../../store/selectors";
import {Text} from "../Text/Text";
interface MeasurementModalProps extends ModalProps {
    setMeasurement: Dispatch<SetStateAction<Measurement>>,
    measurement?: Measurement
    saveMeasurement: () => void;
    isNewMeasurement?: boolean
}
export const MeasurementModal = ({ isNewMeasurement = true, onRequestClose, isVisible, measurement, setMeasurement, saveMeasurement }: MeasurementModalProps) => {
    const {t} = useTranslation();
    const opacity = useRef(new Animated.Value(0)).current
    const language = useAppSelector(getLanguage);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const handleAddMeasurementData = useCallback((field: keyof Measurement, value: Measurement[keyof Measurement]) => {

        const newMeasurement = {...measurement, [field]: value};
        setMeasurement(newMeasurement)
    }, [measurement, setMeasurement]);

    useEffect(() => {
        LayoutAnimation.configureNext({...LayoutAnimation.Presets.easeInEaseOut, duration: showDatePicker ? LayoutAnimation.Presets.easeInEaseOut.duration : 200, delete: { ...LayoutAnimation.Presets.easeInEaseOut.update, duration: 200, property:"scaleY"}  });
        Animated.timing(opacity, {
          toValue: showDatePicker ? 1 : 0,
            duration: showDatePicker ? 300: 50,
            delay: showDatePicker ? 200 : 0,
            useNativeDriver: false
        }).start();
    }, [opacity, showDatePicker])


    return <Modal onRequestClose={onRequestClose} isVisible={isVisible}>
        <View style={{gap: 10, marginTop: 10}}>
            <ThemedTextInput editable={isNewMeasurement} style={{fontSize: 20, borderRadius, padding: 10}}
                             onChangeText={(value) => handleAddMeasurementData("name", value)}
                             value={measurement?.name} clearButtonMode="while-editing"
                             placeholder={t("measurement_placeholder")}/>
            <HStack style={{alignSelf: "stretch"}}><ThemedTextInput returnKeyType="done" keyboardType="decimal-pad" style={{
                flex: 1,
                fontSize: 20,
                borderRadius,
                padding: 10
            }} onChangeText={(value) => handleAddMeasurementData("value", value)} value={measurement?.value}
                                                                    clearButtonMode="while-editing"
                                                                    placeholder={t("measurement")}/>
                <ThemedTextInput editable={isNewMeasurement} style={{flex: 1, fontSize: 20, borderRadius, padding: 10}}
                                 onChangeText={(value) => handleAddMeasurementData("unit", value)}
                                 value={measurement?.unit} clearButtonMode="while-editing"
                                 placeholder={t("measurement_unit")}/></HStack>
            <HStack style={{gap: 10, paddingHorizontal: 10}}>
                    <Pressable style={{ backgroundColor: componentBackgroundColor, borderRadius, flex: 1, padding: 10}} onPress={() => setShowDatePicker((open) => !open)} ><Text style={{ flex: 1,fontSize: 20, color: mainColor}}>{measurement?.date?.toLocaleDateString(language)}</Text></Pressable><Pressable onPress={() => setShowDatePicker((open) => !open)} style={{alignItems: "center",justifyContent: "center", padding: 10, backgroundColor: componentBackgroundColor, borderRadius}}><MaterialCommunityIcons name="calendar" size={26} color={mainColor} /></Pressable></HStack>
            {showDatePicker &&
                <Animated.View style={{opacity, paddingHorizontal: 10}}>
                    <DateTimePicker display="inline" locale={language} onChange={(_ ,date) => handleAddMeasurementData("date", date)} value={measurement?.date ?? new Date(getDateTodayIso())} />
                </Animated.View>}
            <HStack style={{
                backgroundColor: primaryColor,
                padding: 10,
                margin: 10,
                borderRadius,
                gap: 15,
                justifyContent: "center"
            }}>
                <Button onPress={saveMeasurement} style={{text: {fontSize: 16}}} theme="ghost"
                        title={t("measurement_add")}/>
                <MaterialCommunityIcons name="table-large-plus" size={20}/>
            </HStack>
        </View>
    </Modal>
}