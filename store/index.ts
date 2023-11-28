import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist/es/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutSortingMiddleWare } from "./middleware/workoutSorting";
import { reducers } from "./reducers";
import { stateMiddleware } from "./middleware/stateMiddleware";

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
            .concat(workoutSortingMiddleWare)
            .concat(stateMiddleware),
});

export const persistor = persistStore(store);
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = useSelector;

export type AppState = ReturnType<typeof reducers>;
