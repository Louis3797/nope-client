import { SERVER_URL } from "@/constant";
import { useAuth } from "@/hook/useAuth";
import { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const socketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SERVER_URL, {
      auth: { token: window?.sessionStorage.getItem("access_token") ?? "" },
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, []);
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}
