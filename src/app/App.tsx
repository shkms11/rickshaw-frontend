import { HashRouter } from "react-router-dom";
import Providers from "./providers";
import AppRoutes from "@/routes/AppRoutes";
import AiAssistant from "@/features/ai/components/AiAssistant";

export default function App() {
  return (
    //hasrouter for github deployment, unless the link breaks
    <HashRouter>
      <Providers>
        <AppRoutes />
        <AiAssistant />
      </Providers>
    </HashRouter>
  );
}
