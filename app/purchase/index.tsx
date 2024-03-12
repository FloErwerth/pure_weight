import { ThemedView } from "../../components/Themed/ThemedView/View";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigateBack } from "../../hooks/navigate";
import { PageContent } from "../../components/PageContent/PageContent";
import { useAppSelector } from "../../store";
import { getAvailablePackages } from "../../store/selectors/purchases";

export const Purchase = () => {
    const navigateBack = useNavigateBack();
    const packages = useAppSelector(getAvailablePackages);
    return (
        <ThemedView stretch>
            <SiteNavigationButtons title="Purchase" backButtonAction={navigateBack} />
            <PageContent paddingTop={20}></PageContent>
        </ThemedView>
    );
};
