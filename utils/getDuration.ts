export const getDuration = (secondsString?: string) => {
  if (!secondsString) {
    return undefined;
  }

  const seconds = parseFloat(secondsString);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hourString = hours > 0 ? `${hours}` : "";
  const minuteString = minutes > 0 ? `${minutes}` : "";
  const secondString = remainingSeconds > 0 ? `${remainingSeconds}` : "";

  if (hours > 0) {
    return `${hourString}:${minuteString || "0 minute"}${secondString && `:${secondString}`} hours`;
  } else if (!hours && minutes > 0) {
    return `${minuteString}${secondString && `:${secondString}`} minutes`;
  }

  return secondString.concat(" seconds");
};
