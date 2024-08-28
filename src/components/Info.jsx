import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import './Info.css';

const Info = ({ contract, account }) => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [stake, setStake] = useState({ amount: '0', startTime: '0' });

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        try {
          const supply = await contract.balanceOf(account);
          setCurrentBalance(ethers.utils.formatUnits(supply, 0));

          const stakeInfo = await contract.stakes(account);
          setStake({
            amount: ethers.utils.formatUnits(stakeInfo.amount, 0), // Adjust decimals if needed
            startTime: stakeInfo.startTime.toString()
          });
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [contract, account]);

  return (
    <div className="info-container">
      <div className="info-card">
        <h2 className="info-title">DePIN Index Token Info</h2>
        <p className="info-item"><strong>Connected Account:</strong> {account}</p>
        <p className="info-item"><strong>Current Balance:</strong> {currentBalance} DPIT</p>
        {
          <div className="info-stake">
            <p className="info-item"><strong>Amount Staked:</strong> {stake.amount} DPIT</p>
            <p className="info-item"><strong>Staking Start Time:</strong> {new Date(parseInt(stake.startTime) * 1000).toLocaleString()}</p>
          </div>
        }
      </div>
    </div>
  );
};

export default Info;
