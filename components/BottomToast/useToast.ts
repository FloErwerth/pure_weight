import { useCallback, useMemo, useRef, useState } from "react";
import { noop } from "lodash";

export const useToast = () => {
    const [showToast, setShowToast] = useState(false);
    const toastRef = useRef<{ restart: () => void }>({ restart: noop });

    const openToast = useCallback(() => {
        setShowToast(true);
    }, []);

    const closeToast = useCallback(() => {
        setShowToast(false);
    }, []);

    return useMemo(() => ({ showToast, toastRef, openToast, closeToast }), [showToast, toastRef]);
};
