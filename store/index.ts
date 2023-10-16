import { configureStore } from "@reduxjs/toolkit";
import { storeReducer } from "./reducer";
import { useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, storeReducer);
export const store = configureStore({
  reducer: persistedReducer,
  preloadedState: {
    setIndex: 0,
    exerciseIndex: 0,
    trainingDayIndex: 0,
    isFirstTimeRendered: true,
    editedExerciseIndex: undefined,
    trainingDays: [],
  },
});
export const persistor = persistStore(store);
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = useSelector;
