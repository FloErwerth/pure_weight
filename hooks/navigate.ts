import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";
import { Routes } from "../types/navigation";

export const navigationRef = createNavigationContainerRef<typeof Routes>();

export function useNavigate() {
    function navigate<T extends keyof typeof Routes>(name: T, params?: ParamListBase[T]) {
        if (navigationRef.isReady()) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigationRef.navigate(Routes[name]["screen"], { ...params });
        }
    }

    return navigate;
}

export function useNavigateBack() {
    function navigateBack() {
        if (navigationRef.isReady()) {
            navigationRef.goBack();
        }
    }

    return navigateBack;
}
