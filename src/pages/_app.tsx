import Layout from "@/components/Layout";
import NavLayout from "@/components/NavLayout";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import { Theme } from "react-daisyui";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Theme dataTheme="light">
        <AuthProvider>
          <SnackbarProvider
            autoHideDuration={4000}
            maxSnack={3}
            preventDuplicate
          >
            <NavLayout>
              <SocketProvider>
                <Component {...pageProps} />
              </SocketProvider>
            </NavLayout>
          </SnackbarProvider>
        </AuthProvider>
      </Theme>
    </>
  );
}
