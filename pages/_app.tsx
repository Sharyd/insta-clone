import '../styles/globals.css';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { RecoilRoot } from 'recoil';
import { ChatContextProvider } from '../store/ChatContext';
import { ErrorBoundary } from 'react-error-boundary';
import { TbMoodSad } from 'react-icons/tb';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChatContextProvider>
      <RecoilRoot>
        <NextNProgress />
        <ErrorBoundary
          fallback={
            <div className="flex bg-red-500 items-center animate  gap-4 text-white/90 text-3xl justify-center min-h-screen">
              <div className="flex flex-col items-center gap-4 ">
                <TbMoodSad className="text-white/90 w-20 h-20 " />
                <p className="bg-red-500 py-3 px-5 rounded-md">
                  Ooops. Something went wrong
                </p>
              </div>
            </div>
          }
        >
          <Component {...pageProps} />
        </ErrorBoundary>
      </RecoilRoot>
    </ChatContextProvider>
  );
}

export default MyApp;
