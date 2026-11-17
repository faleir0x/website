import { Home } from "@/features/home/home";
import { I18nProvider } from "@/lib/i18n/i18n";

export default function Page() {
  return (
    <I18nProvider>
      <Home />
    </I18nProvider>
  );
}
