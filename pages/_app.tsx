import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { ChatContextProvider } from "../store/ChatContext";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChatContextProvider>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ChatContextProvider>
  );
}

export default MyApp;
