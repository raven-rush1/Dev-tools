// src/app/providers.tsx

"use client";

import { ReactNode } from "react";
import {
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";
import {
  mainnet,
  polygon,
  arbitrum,
  sepolia,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

// WalletConnect project ID (only one needed)
const projectId = "00f59570459441f8131d3f6caa94ca43";

// Supported chains
const chains = [mainnet, polygon, arbitrum, sepolia] as const;

const config = getDefaultConfig({
  appName: "Raven Rush",
  projectId,
  chains,
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
  },
});
const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
