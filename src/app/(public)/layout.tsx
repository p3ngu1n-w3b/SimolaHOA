import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { EmergencyFab } from "@/components/site/emergency-fab";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <EmergencyFab />
      <InstallPrompt />
    </div>
  );
}
