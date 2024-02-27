import { createContext, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { noop } from "lodash";

export const HistoryContext = createContext<{
    requestActive: (setIndex: number | undefined, requestNext?: boolean) => void;
    activeSet?: number;
}>({ requestActive: noop, activeSet: undefined });

export const HistoryContextProvider = ({ children }: PropsWithChildren) => {
    const [activeSet, setActiveSet] = useState<number | undefined>(undefined);

    const requestActive = useCallback((setIndex: number | undefined) => {
        setActiveSet(setIndex);
    }, []);

    const contextValue = useMemo(() => ({ requestActive, activeSet }), [requestActive, activeSet]);

    return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>;
};
