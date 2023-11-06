import Toast, { ToastProps } from "react-native-root-toast";
import { useTheme } from "../../../theme/context";

export const ThemedToast = (props: ToastProps) => {
  const { primaryColor } = useTheme();
  return <Toast backgroundColor={primaryColor} {...props} />;
};
