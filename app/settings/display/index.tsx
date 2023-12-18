import { LanguageSelection } from "../../../components/App/settings/components/Selections/LanguageSelection/LanguageSelection";
import { ThemeSelection } from "../../../components/App/settings/components/Selections/ThemeSelection/ThemeSelection";
import { KeepAwakeSelection } from "../../../components/App/settings/components/Selections/KeepAwakeSelection/KeepAwakeSelection";

export const Display = () => {
    return (
        <>
            <LanguageSelection />
            <ThemeSelection />
            <KeepAwakeSelection />
        </>
    );
};
