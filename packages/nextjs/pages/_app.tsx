import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { withInitialData } from "~~/hoc/withInitialData";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import { store } from "~~/store/store";
import "~~/styles/globals.css";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  const subgraphUri = "https://api.studio.thegraph.com/query/53666/skypiea/version/latest";
  const apolloClient = new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });

  const EnhancedComponent = withInitialData(Component);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <WagmiConfig config={wagmiConfig}>
          <NextNProgress />
          <RainbowKitProvider
            chains={appChains.chains}
            avatar={BlockieAvatar}
            theme={isDarkTheme ? darkTheme() : lightTheme()}
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="relative flex flex-col flex-1 p-8">
                <p>
                  Please on-board by following this{" "}
                  <a
                    href="https://tinglik.notion.site/On-boarding-7-Proxies-Network-0967d277dfee49dfb2e537a1b89961b6"
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                  >
                    notion guide
                  </a>{" "}
                  first!
                </p>
                <EnhancedComponent />
              </main>
              <Footer />
            </div>
            <Toaster />
          </RainbowKitProvider>
        </WagmiConfig>
      </ApolloProvider>
    </Provider>
  );
};

export default ScaffoldEthApp;
