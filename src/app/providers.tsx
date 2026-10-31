import { Provider } from "react-redux";
import { store } from "@/app/store";

/** Makes the shared Redux store available to every route and global widget. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
