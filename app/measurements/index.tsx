import { DEFAULT_PLUS, SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import React, { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { PageContent } from "../../components/PageContent/PageContent";
import { ThemedView } from "../../components/Themed/ThemedView/View";
import { Swipeable } from "../../components/WorkoutCard/Swipeable";
import { RenderedMeasurement } from "../../components/App/measurements/RenderedMeasurement";
import { BottomToast } from "../../components/BottomToast/BottomToast";
import { deleteMeasurement, recoverMeasurement, setEditedMeasurement, setSearchedMeasurements, setupNewMeasurement } from "../../store/reducers/measurements";
import { getSearchedMeasurements, getSortedMeasurements } from "../../store/selectors/measurements/measurementSelectors";
import { useNavigate } from "../../hooks/navigate";
import { useToast } from "../../components/BottomToast/useToast";
import { MeasurementId } from "../../components/App/measurements/types";
import { styles } from "../../components/App/measurements/styles";
import { HStack } from "../../components/Stack/HStack/HStack";
import { trainStyles } from "../../components/App/train/trainStyles";
import { Sorting } from "../../components/Sorting/Sorting";
import { ExpandableSearchbar } from "../../components/Searchbar/ExpandableSearchbar";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../components/BottomSheetModal/ThemedBottomSheetModal";
import { AnswerText } from "../../components/HelpQuestionAnswer/AnswerText";
import { ThemedPressable } from "../../components/Themed/Pressable/Pressable";
import { ThemedMaterialCommunityIcons } from "../../components/Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../../components/Themed/ThemedText/Text";
import { RemainingMeasurementsText } from "../../components/CreationBarrierTexts/RemainingMeasurementsText";
import { getIsPro } from "../../store/selectors/purchases";
import { useTypedTranslation } from "../../locales/i18next";
import { TranslationKeys } from "../../locales/translationKeys";

export function Measurements() {
	const { t } = useTypedTranslation();
	const measurements = useAppSelector(getSortedMeasurements);
	const searchedMeasurements = useAppSelector(getSearchedMeasurements);
	const dispatch = useAppDispatch();
	const isPro = useAppSelector(getIsPro);
	const navigate = useNavigate();
	const { toastRef, openToast, closeToast, showToast } = useToast();
	const [deletedMeasurementId, setDeletedMeasurementId] = useState<MeasurementId | null>(null);
	const { ref: deleteWarningRef, openBottomSheet: openDeleteWarning, closeBottomSheet: closeDeleteWarning } = useBottomSheetRef();
	const isAllowedToCreateMeasurement = useMemo(() => isPro || measurements.length < 3, [isPro, measurements]);

	const filteredMeasurements = useMemo(
		() =>
			measurements.filter((measurement) => {
				if (!searchedMeasurements) {
					return true;
				}

				return measurement.name.toLowerCase().includes(searchedMeasurements.toLowerCase());
			}),
		[measurements, searchedMeasurements],
	);

	const handleAddNewMeasurement = useCallback(() => {
		dispatch(setupNewMeasurement());
		navigate("measurement/create");
	}, [dispatch, navigate]);

	const handleSetSearchedMeasurements = useCallback(
		(searched: string) => {
			dispatch(setSearchedMeasurements(searched));
		},
		[dispatch],
	);

	const handleAddExistingMeasurement = useCallback(
		(measurementId: MeasurementId) => {
			const measurement = measurements?.find((measurement) => measurement.measurementId === measurementId);
			dispatch(setEditedMeasurement({ isEditing: false, isNew: false, measurement }));
			navigate("measurement/create");
		},
		[dispatch, measurements, navigate],
	);

	const handleDeleteMeasurement = useCallback(() => {
		if (deletedMeasurementId) {
			dispatch(deleteMeasurement(deletedMeasurementId));
			if (showToast && toastRef.current) {
				toastRef.current.restart();
			}
			closeDeleteWarning();
			openToast();
		}
	}, [closeDeleteWarning, deletedMeasurementId, dispatch, openToast, showToast, toastRef]);

	const handleRecoverMeasurement = useCallback(() => {
		dispatch(recoverMeasurement());
		closeToast();
	}, [closeToast, dispatch]);

	const handleEditMeasuremnt = useCallback(
		(measurementId: MeasurementId) => {
			const measurement = measurements?.find((measurement) => measurement.measurementId === measurementId);
			dispatch(setEditedMeasurement({ isNew: false, isEditing: true, measurement }));
			navigate("measurement/create");
		},
		[dispatch, measurements, navigate],
	);

	const mappedMeasurements = useMemo(
		() =>
			filteredMeasurements?.map((measurement) => (
				<Swipeable
					onEdit={() => handleEditMeasuremnt(measurement.measurementId)}
					onDelete={() => {
						setDeletedMeasurementId(measurement.measurementId);
						openDeleteWarning();
					}}
					key={measurement.measurementId}
					onClick={() => handleAddExistingMeasurement(measurement.measurementId)}
				>
					<RenderedMeasurement measurement={measurement} />
				</Swipeable>
			)),
		[filteredMeasurements, handleAddExistingMeasurement, handleEditMeasuremnt, openDeleteWarning],
	);

	return (
		<ThemedView stretch background>
			<SiteNavigationButtons
				confirmButtonDisabled={!isAllowedToCreateMeasurement}
				titleFontSize={40}
				title={t(TranslationKeys.MEASUREMENTS)}
				handleConfirm={handleAddNewMeasurement}
				handleConfirmIcon={DEFAULT_PLUS}
			/>
			{measurements.length > 1 && (
				<PageContent ghost>
					<HStack ghost style={trainStyles.searchAndFilterBar}>
						<Sorting type="Workout" />
						<ExpandableSearchbar handleSetSearchManual={handleSetSearchedMeasurements} />
					</HStack>
				</PageContent>
			)}
			<PageContent showsVerticalScrollIndicator={false} stretch background ignoreGap scrollable>
				<ThemedView ghost stretch style={styles.wrapper}>
					{mappedMeasurements}
				</ThemedView>
				<RemainingMeasurementsText />
			</PageContent>
			<BottomToast
				reference={toastRef}
				onRequestClose={closeToast}
				open={showToast}
				messageKey={TranslationKeys.MEASUREMENT_DELETED_UNDO}
				titleKey={TranslationKeys.MEASUREMENT_DELETED_MESSAGE}
				onRedo={handleRecoverMeasurement}
				bottom={10}
			/>
			<ThemedBottomSheetModal title={t(TranslationKeys.ALERT_DELETE_MEASUREMENT_TITLE)} ref={deleteWarningRef}>
				<PageContent paddingTop={20} stretch ghost>
					<AnswerText>{t(TranslationKeys.ALERT_DELETE_MEASUREMENT_CONTENT)}</AnswerText>
					<ThemedPressable style={trainStyles.deleteButtonWrapper} center round onPress={handleDeleteMeasurement}>
						<HStack style={trainStyles.confirmOverwriteWrapper} round center>
							<ThemedMaterialCommunityIcons ghost name="delete" size={24} />
							<Text center ghost style={trainStyles.button}>
								{t(TranslationKeys.ALERT_DELETE_MEASUREMENT_CONFIRM)}
							</Text>
						</HStack>
					</ThemedPressable>
				</PageContent>
			</ThemedBottomSheetModal>
		</ThemedView>
	);
}
