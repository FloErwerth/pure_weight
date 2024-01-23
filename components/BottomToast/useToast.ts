import { useMemo, useRef } from "react";
import { noop } from "lodash";

export const useToastRef = () => {
    const toastRef = useRef<{ restart: () => void }>({ restart: noop });

    return useMemo(() => toastRef, [toastRef]);
};
