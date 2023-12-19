import { LanguageSelection } from "../../components/Selections/LanguageSelection/LanguageSelection";
import { ThemeSelection } from "../../components/Selections/ThemeSelection/ThemeSelection";
import { KeepAwakeSelection } from "../../components/Selections/KeepAwakeSelection/KeepAwakeSelection";

export const Display = () => {
    return (
        <>
            <LanguageSelection />
            <ThemeSelection />
            <KeepAwakeSelection />
        </>
    );
};
