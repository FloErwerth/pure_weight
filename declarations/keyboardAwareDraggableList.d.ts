declare module "react-native-keyboard-aware-scroll-view/lib/KeyboardAwareHOC" {
  import { FC } from "react";
  import { DraggableFlatListProps } from "react-native-draggable-flatlist";

  export default function listenToKeyboardEvents<T>(config: { enableOnAndroid: boolean; enableAutomaticScroll: boolean }): (component: FC<DraggableFlatListProps<T>>) => FC<DraggableFlatListProps<T>>;
}
