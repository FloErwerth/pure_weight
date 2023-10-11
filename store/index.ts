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
    editedExerciseIndex: undefined,
    trainingDays: [{ name: "Brust 1", exercises: [{ name: "Bankdrücken", weight: "50", reps: "5", pause: "2.5", sets: "5", doneExerciseEntries: {} }] }],
  },
});
export const persistor = persistStore(store);
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = useSelector;
