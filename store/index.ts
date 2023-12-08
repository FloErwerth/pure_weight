import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist/es/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reducers } from "./reducers";
import { stateMiddleware } from "./middleware/stateMiddleware";
import { WorkoutAction } from "./reducers/workout";
import { SettingsAction } from "./reducers/settings";
import { MetadataAction } from "./reducers/metadata";
import { ErrorActions } from "./reducers/errors";
import { MeasurementActions } from "./reducers/measurements";
import { weightMiddleware } from "./middleware/weightUnitMiddleware";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            .concat(stateMiddleware)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            .concat(weightMiddleware),
});

export const persistor = persistStore(store);
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = useSelector;

export type AppActions = WorkoutAction | SettingsAction | MetadataAction | ErrorActions | MeasurementActions;
export type AppState = ReturnType<typeof reducers>;
