import React from "react";
import {ToastContainer,toast } from 'react-toastify'
import { useAlchemy } from "../Helpers/metamask.helper";
import 'react-toastify/dist/ReactToastify.css';
function Header() {
    const { connectWallet } = useAlchemy()
    
    return (
        <>
            <header className="header">
                <a href="index.html" className="logo"><img src="" />Fugu</a>
                <button onClick={() => connectWallet()}>Collect Wallet </button>
                {/* <button onClick={notify}>toast</button> */}
                {/* <ToastContainer/> */}
            </header>
        </>
    )
}

export default Header;