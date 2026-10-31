import { Outlet } from "react-router-dom";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";

/** Wraps every routed page in the shared site header and footer. */
export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      {/* Main (NO top gap, full seamless flow) */}
      <main className="flex-1 w-full">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
