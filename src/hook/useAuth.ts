import { authContext } from "@/context/AuthContext";
import { AuthContextType } from "@/types";
import { useContext } from "react";

export const useAuth = (): AuthContextType => useContext(authContext);
