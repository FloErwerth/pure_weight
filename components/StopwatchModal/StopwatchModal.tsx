import { useAppSelector } from "../../store";
import { Modal, ModalProps } from "../Modal/Modal";
import { getPauseTime } from "../../store/selectors";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod/lib/index";
import { Button } from "react-native";
import { Text } from "../Themed/ThemedText/Text";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { TaskManagerTaskExecutor } from "expo-task-manager";

const pauseTimeDecoder = z.string().transform((pauseTime) => {
  return parseFloat(pauseTime);
});

TaskManager.defineTask("timer", async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const StopwatchModal = (props: ModalProps) => {
  const currentPauseTime = useAppSelector(getPauseTime);
  const [timerStarted, setTimerStarted] = useState(false);

  const getPauseTimeSeconds = useCallback(() => {
    const parsedTime = pauseTimeDecoder.safeParse(currentPauseTime);
    if (parsedTime.success) {
      return parsedTime.data;
    } else {
      return 120;
    }
  }, [currentPauseTime]);

  useEffect(() => {
    if (currentPauseTime && !timerStarted) {
      setTimeLeft(getPauseTimeSeconds());
    }
  }, [currentPauseTime, getPauseTimeSeconds, timerStarted]);

  const [timeLeft, setTimeLeft] = useState<number>(getPauseTimeSeconds());

  return (
    <Modal {...props}>
      <Button
        title="Start"
        onPress={() => {
          BackgroundFetch.registerTaskAsync("timer").then((result) => console.log(result));
        }}
      />
      <Text>{timeLeft}</Text>
    </Modal>
  );
};
