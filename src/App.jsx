import React from "react";
import Home from "./Pages/Home";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import ConnectWallet from './Connectors/connectWallet';
import 'react-toastify/dist/ReactToastify.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.min.js"
import { toast, ToastContainer } from "react-toastify";

function getLibrary(provider) {
    return new Web3(provider);
}
const App = () => {
   
    return (
        <>
            <Web3ReactProvider getLibrary={getLibrary}>
                <ConnectWallet />
                <Home />

                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </Web3ReactProvider>
        </>
    )
}

export default App;