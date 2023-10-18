import { Modal } from "../Modal/Modal";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

interface PauseModalProps {
  isVisible: boolean;
  duration: string;
  onTimerDone: () => void;
  onCancelTimer: () => void;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours > 0 ? `${String(hours).padStart(2, "0")}:` : undefined;
  const formattedMinutes = minutes > 0 ? `${String(minutes).padStart(2, "0")}:` : undefined;
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  if (formattedHours && formattedMinutes) {
    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  } else if (formattedMinutes) {
    return `${formattedMinutes}${formattedSeconds}`;
  } else {
    return `${formattedSeconds} s`;
  }
}

export const PauseModal = ({ isVisible, duration, onTimerDone, onCancelTimer }: PauseModalProps) => {
  const [parsedDurationSeconds, setParsedDurationSeconds] = useState(parseFloat(duration) * 60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(parsedDurationSeconds);

  useEffect(() => {
    if (isVisible) {
      setParsedDurationSeconds(parseFloat(duration) * 60);
      setTimeLeftSeconds(parseFloat(duration) * 60);
      setTimerStarted(true);
    }
  }, [duration, isVisible]);

  const handleCancelTimer = useCallback(() => {
    setTimerStarted(false);
    onCancelTimer();
  }, [onCancelTimer]);

  useEffect(() => {
    if (timerStarted && isVisible) {
      if (timeLeftSeconds > 0) {
        setTimeout(() => setTimeLeftSeconds(timeLeftSeconds - 1), 1000);
      } else {
        setTimerStarted(false);
        onTimerDone();
      }
    }
  }, [isVisible, onTimerDone, parsedDurationSeconds, timeLeftSeconds, timerStarted]);

  if (isNaN(parsedDurationSeconds)) {
    return null;
  }

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.innerWrapper}>
        <View style={styles.clockWrapper}>
          <Text style={styles.clock}>{formatTime(timeLeftSeconds)}</Text>
        </View>
        <Pressable onPress={handleCancelTimer}>
          <Text>Cancel Timer</Text>
        </Pressable>
      </View>
    </Modal>
  );
};
