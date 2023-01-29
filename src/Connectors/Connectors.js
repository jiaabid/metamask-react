import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

export const walletconnect = new WalletConnectConnector({
  rpc: { 5: "https://eth-goerli.g.alchemy.com/v2/ICiWw-r0GRzkPbmXok_3k1m43NW6_wAd" },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 97, 56, 137, 80001],
});
