import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";

export const getMetadataState = ({ metadataState }: AppState) => metadataState;
export const getIsFirstTimeRendered = createSelector([getMetadataState], (metadata) => metadata.isFirstTimeRendered);
export const getAppInstallDate = createSelector([getMetadataState], (metadata) => metadata.appInstallDate);
export const getStateType = createSelector([getMetadataState], (metadata) => metadata.developmentState);
