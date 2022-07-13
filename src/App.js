
import './App.css';

import { NavigationBar } from './components/nav';
import { AddWatch } from './components/newWatch';
import { Watches } from './components/allWatch';
import { useState, useEffect, useCallback } from "react";


import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import watch from "./contracts/watch.abi.json";
import IERC from "./contracts/IERC.abi.json";


const ERC20_DECIMALS = 18;



const contractAddress = "0x2281E879c43794c26C195b09675262C96851296C";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [watches, setWatches] = useState([]);
  


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(watch, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  const getWatches = useCallback(async () => {
    const watchesLength = await contract.methods.getWatchesLength().call();
    const watches = [];
    for (let index = 0; index < watchesLength; index++) {
      let _watches = new Promise(async (resolve, reject) => {
      let watch = await contract.methods.getWatch(index).call();

        resolve({
          index: index,
          owner: watch[0],
          name: watch[1],
          image: watch[2],
          description: watch[3],
          price: watch[4]  
        });
      });
      watches.push(_watches);
    }


    const _watches = await Promise.all(watches);
    setWatches(_watches);
  }, [contract]);


  const addWatch = async (
    _name,
    _image,
    _description,
    _price,
 
  ) => {
    let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods
        .addWatch(_name, _image, _description, price)
        .send({ from: address });
      getWatches();
    } catch (error) {
      alert(error);
    }
  };

  const updatePrice = async (_index, _price) => { 
    const price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods.updatePrice(_index, price).send({ from: address });
      getWatches();
      alert("you have successfully updated the price");
    } catch (error) {
      alert(error);
    }};



    const updateDescription = async (_index, _description) => { 
      try {
        await contract.methods.updateDescription(_index, _description).send({ from: address });
        getWatches();
        alert("you have successfully updated the description");
      } catch (error) {
        alert(error);
      }};



  const removeWatch = async (
    _index
  ) => {
    try {
      await contract.methods
        .removeWatch(_index)
        .send({ from: address });
      getWatches();
    } catch (error) {
      alert(error);
    }
  };


  const buyWatch = async (_index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
      const cost = watches[_index].price;
      await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });
      await contract.methods.buyWatch(_index).send({ from: address });
      getWatches();
      getBalance();
      alert("you have successfully bought this watch");
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getWatches();
    }
  }, [contract, getWatches]);
  
  return (
    <div className="App">
      <NavigationBar cUSDBalance={cUSDBalance} />
      <Watches watches={watches} buyWatch={buyWatch} walletAddress={address} updatePrice={updatePrice} removeWatch={removeWatch} updateDescription={updateDescription}/>
      <AddWatch addWatch={addWatch} />
    </div>
  );
}

export default App;