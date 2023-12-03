import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";

export const getMetadata = ({ metadataState }: AppState) => metadataState;
export const getIsFirstTimeRendered = createSelector([getMetadata], (metadata) => metadata.isFirstTimeRendered);
export const getAppInstallDate = createSelector([getMetadata], (metadata) => metadata.appInstallDate);
export const getStateType = createSelector([getMetadata], (metadata) => metadata.developmentState);
