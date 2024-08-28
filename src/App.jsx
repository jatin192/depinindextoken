import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ABI from './ABI.json';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mint from './components/Mint';
import Burn from './components/Burn';
import Stake from './components/Stake';
import Withdraw from './components/Withdraw';
import Info from './components/Info';
import Navbar from './components/Navbar';

const App = () => {
  const [account_i, set_account_func] = useState('');
  const [contract_i, set_contract_func] = useState(null);

  useEffect(() => {
    const wallet = async () => {
      if (window.ethereum) {
        const provider_ = new ethers.providers.Web3Provider(window.ethereum);
        const chainId = await provider_.getNetwork().then(net => net.chainId);
        const Sepolia_Chain_ID = 11155111;

        if (chainId !== Sepolia_Chain_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(Sepolia_Chain_ID) }],
            });
          } catch (i) {
            console.error('Error in switching to Sepolia network:', i);
          }
        }

        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', () => window.location.reload());

        await provider_.send('eth_requestAccounts', []);
        const signer_ = provider_.getSigner();
        const address_ = await signer_.getAddress();
        set_account_func(address_);

        const contract_instance = new ethers.Contract("0xEA9E46A21CceA6C2992Af045b723A7fF2A3edF91", ABI, signer_);
        set_contract_func(contract_instance);
      }
    };
    wallet();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Mint contract={contract_i} />} />
        <Route path="/mint" element={<Mint contract={contract_i} />} />
        <Route path="/burn" element={<Burn contract={contract_i} />} />
        <Route path="/stake" element={<Stake contract={contract_i} />} />
        <Route path="/withdraw" element={<Withdraw contract={contract_i} />} />
      </Routes>
      <Info contract={contract_i} account={account_i} />
    </Router>
  );
};

export default App;
