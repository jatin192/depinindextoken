import React, { useState } from 'react';
import './Stake.css'; // Import CSS for this component

const Stake = ({ contract }) => {
  const [dpitAmount, setDpitAmount] = useState('');

  const handleStake = async () => {
    if (contract) {
      try {
        let tx = await contract.stake(dpitAmount);
        await tx.wait();
        alert('Stake successful');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="stake-container">
      <h2 className="stake-title">Stake DPIT</h2>
      <input
        type="text"
        className="stake-input"
        placeholder="Enter DPIT Amount"
        value={dpitAmount}
        onChange={(e) => setDpitAmount(e.target.value)}
      />
      <button className="stake-button" onClick={handleStake}>Stake</button>
    </div>
  );
};

export default Stake;
