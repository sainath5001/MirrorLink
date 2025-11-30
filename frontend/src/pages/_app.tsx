import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfigProvider } from '@/hooks/useWagmiProvider';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfigProvider>
      <div className="min-h-screen flex flex-col bg-black">
        <NavBar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-black">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </WagmiConfigProvider>
  );
}

