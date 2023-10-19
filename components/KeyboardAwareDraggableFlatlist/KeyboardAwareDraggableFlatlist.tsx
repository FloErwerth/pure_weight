import DraggableFlatList from "react-native-draggable-flatlist";

import listenToKeyboardEvents from "react-native-keyboard-aware-scroll-view/lib/KeyboardAwareHOC";
import { ExerciseMetaData } from "../../store/types";

const config = {
  enableOnAndroid: true,
  enableAutomaticScroll: true,
};
type ListType = {
  onDelete: () => void;
  edited: boolean;
  handleCancel: () => void;
  onEdit: () => void;
  exercise: ExerciseMetaData;
  index: number;
  handleOnConfirmEdit: (exercise: ExerciseMetaData) => void;
};
export default listenToKeyboardEvents<ListType>(config)(DraggableFlatList);
