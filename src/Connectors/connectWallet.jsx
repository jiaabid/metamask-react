import React, { useCallback, useEffect } from "react";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Injected } from "./Connectors";

const ConnectWallet = () => {
  const web3context = useWeb3React();

  const getErrorMessage = (e) => {
    if (e instanceof UnsupportedChainIdError) {
      return "Unsupported Network";
    } else if (e instanceof NoEthereumProviderError) {
      return "No Wallet Found";
    } else if (e instanceof UserRejectedRequestError) {
      return "Wallet Connection Rejected";
    } else if (e.code === -32002) {
      return "Wallet Connection Request Pending";
    } else {
      return "An Error Occurred";
    }
  };

  const activateWallet = useCallback(
    (connector, onClose) => {
      if (
        connector instanceof WalletConnectConnector &&
        // connector.walletConnectProvider?.wc?.uri
        true
      ) {
        connector.walletConnectProvider = undefined;
      } else if (connector) {
        web3context
          .activate(connector, undefined, true)
          .then(() => {
            console.log("Success");
          })
          .catch((e) => {
            const err = getErrorMessage(e);

            console.error("Error  activateWallet -> ", err);
          });
      }
    },
    [web3context]
  );

  useEffect(() => {
    activateWallet(Injected);
  }, []);
  return <div></div>;
};

export default ConnectWallet;