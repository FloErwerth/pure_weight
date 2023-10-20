import { configureStore } from "@reduxjs/toolkit";
import { storeReducer } from "./reducer";
import { useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist/es/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "./types";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, storeReducer);

export const mockState: AppState = {
  setIndex: 0,
  settings: { language: "en" },
  trainingDayIndex: undefined,
  isFirstTimeRendered: true,
  exerciseIndex: 0,
  errors: [],
  trainingDays: [
    {
      name: "Brust 1",
      exercises: [
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
        {
          name: "Butterfly",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-01": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
          },
        },
      ],
    },
    {
      name: "Brust 2",
      exercises: [
        {
          name: "Bankdrücken",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {},
        },
        {
          name: "Butterfly",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {},
        },
      ],
    },
    {
      name: "Rücken 1",
      exercises: [
        {
          name: "Klimmzüge",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-03": {
              0: { reps: "5", weight: "50" },
              1: { reps: "5", weight: "50" },
              3: { reps: "5", weight: "50" },
              4: { reps: "5", weight: "50" },
            },
            "2023-01-05": {
              0: { reps: "2", weight: "55" },
              1: { reps: "3", weight: "55" },
              3: { reps: "5", weight: "55" },
              4: { reps: "5", weight: "55" },
            },
            "2023-01-07": {
              0: { reps: "5", weight: "57,5" },
              1: { reps: "6", weight: "57,5" },
              3: { reps: "6", weight: "57,5" },
              4: { reps: "6.5", weight: "57,5" },
            },
            "2023-01-09": {
              0: { reps: "5", weight: "60" },
              1: { reps: "5", weight: "60" },
              3: { reps: "5", weight: "60" },
              4: { reps: "5", weight: "60" },
            },
            "2023-01-11": {
              0: { reps: "5", weight: "62.5" },
              1: { reps: "5", weight: "62.5" },
              3: { reps: "5", weight: "62.5" },
              4: { reps: "5", weight: "62.5" },
            },
            "2023-01-12": {
              0: { reps: "5", weight: "58" },
              1: { reps: "5", weight: "58" },
              3: { reps: "5", weight: "58" },
              4: { reps: "5", weight: "58" },
            },
            "2023-01-13": {
              0: { reps: "5", weight: "58" },
              1: { reps: "5", weight: "58" },
              3: { reps: "5", weight: "58" },
              4: { reps: "5", weight: "58" },
            },
            "2023-01-14": {
              0: { reps: "5", weight: "58" },
              1: { reps: "5", weight: "58" },
              3: { reps: "5", weight: "58" },
              4: { reps: "5", weight: "58" },
            },
            "2023-01-16": {
              0: { reps: "5", weight: "49" },
              1: { reps: "5", weight: "49" },
              3: { reps: "5", weight: "49" },
              4: { reps: "5", weight: "49" },
            },
            "2023-01-17": {
              0: { reps: "5", weight: "51" },
              1: { reps: "5", weight: "51" },
              3: { reps: "5", weight: "51" },
              4: { reps: "5", weight: "51" },
            },
            "2023-01-18": {
              0: { reps: "5", weight: "55" },
              1: { reps: "5", weight: "55" },
              3: { reps: "5", weight: "55" },
              4: { reps: "5", weight: "55" },
            },
            "2023-01-19": {
              0: { reps: "5", weight: "58" },
              1: { reps: "5", weight: "58" },
              3: { reps: "5", weight: "58" },
              4: { reps: "5", weight: "58" },
            },
          },
        },
        {
          name: "Rudern",
          weight: "50",
          sets: "5",
          reps: "5",
          pause: " 2",
          doneExerciseEntries: {
            "2023-01-05": {
              0: { reps: "5", weight: "52" },
              1: { reps: "5", weight: "52" },
              3: { reps: "5", weight: "52" },
              4: { reps: "5", weight: "52" },
            },
            "2023-01-07": {
              0: { reps: "5", weight: "54" },
              1: { reps: "5", weight: "54" },
              3: { reps: "5", weight: "54" },
              4: { reps: "5", weight: "54" },
            },
            "2023-01-08": {
              0: { reps: "5", weight: "54" },
              1: { reps: "5", weight: "54" },
              3: { reps: "5", weight: "54" },
              4: { reps: "5", weight: "54" },
            },
            "2023-01-09": {
              0: { reps: "5", weight: "54" },
              1: { reps: "5", weight: "54" },
              3: { reps: "5", weight: "54" },
              4: { reps: "5", weight: "54" },
            },
            "2023-01-11": {
              0: { reps: "5", weight: "54" },
              1: { reps: "5", weight: "54" },
              3: { reps: "5", weight: "54" },
              4: { reps: "5", weight: "54" },
            },
            "2023-01-12": {
              0: { reps: "5", weight: "54" },
              1: { reps: "5", weight: "54" },
              3: { reps: "5", weight: "54" },
              4: { reps: "5", weight: "54" },
            },
          },
        },
      ],
    },
  ],
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = useSelector;
