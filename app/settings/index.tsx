import { SafeAreaView } from "../../components/SafeAreaView/SafeAreaView";
import { SiteNavigationButtons } from "../../components/SiteNavigationButtons/SiteNavigationButtons";
import { useNavigate } from "../../utils/navigate";
import { Routes } from "../../types/routes";

export default function Index() {
  const navigate = useNavigate();
  return (
    <SafeAreaView>
      <SiteNavigationButtons handleBack={() => navigate(Routes.HOME)} title="Settings" />
    </SafeAreaView>
  );
}
