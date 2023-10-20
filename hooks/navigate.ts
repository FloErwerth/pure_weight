import { createNavigationContainerRef } from "@react-navigation/native";

export const Routes = {
  workouts: {
    screen: "tabs",
  },
  train: {
    screen: "workouts/train/index",
  },
  create: {
    screen: "workouts/create/index",
  },
  progress: {
    screen: "tabs",
  },
  chart: {
    screen: "progress/chart/index",
  },
  settings: {
    screen: "tabs",
  },
};

export const navigationRef = createNavigationContainerRef<typeof Routes>();

export function useNavigate() {
  function navigate<T extends keyof typeof Routes>(name: T) {
    if (navigationRef.isReady()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      navigationRef.navigate(Routes[name]["screen"]);
    }
  }

  return navigate;
}
