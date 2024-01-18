import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
export const configureWallets = () => {
  const projectId = process.env.RAINBOW_WALLET_PROJECT_ID;
  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, zora], // , polygon, optimism, arbitrum, zora
    [
      alchemyProvider({ apiKey: process.env.ALCHEMA_PROVIDER_API_KEY }),
      publicProvider(),
    ]
  );
  const { wallets } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: process.env.RAINBOW_WALLET_PROJECT_ID,
    chains,
  });

  // Create connectors for the specified wallets.
  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      // Create a MetaMask wallet connector.
      // Create a Coinbase wallet connector.
      // Create a WalletConnect wallet connector.
      wallets: [
        metaMaskWallet({ projectId, chains }),
        coinbaseWallet({ projectId, chains }),
        walletConnectWallet({ projectId, chains }),
      ],
    },
  ]);

  // Create a configuration for the Wagmi wallet library.
  const wagmiConfig = createConfig({
    // Automatically connect to available wallets.
    autoConnect: true,
    // Use the created connectors.
    connectors,
    // Specify the public client (if needed).
    publicClient,
  });
  return {
    chains,
    wallets,
    connectors,
    wagmiConfig,
  };
};
