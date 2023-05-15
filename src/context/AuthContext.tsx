import useAuthProvider from "@/hook/useAuthProvider";
import { createContext } from "react";

export const authContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
