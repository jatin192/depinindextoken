import React, { useState } from 'react';
import './Burn.css'; // Import CSS for this component

const Burn = ({ contract }) => {
  const [dpitAmount, setDpitAmount] = useState('');

  const handleBurn = async () => {
    if (contract) {
      try {
        let tx = await contract.burn(dpitAmount);
        await tx.wait();
        alert('Burn successful');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="burn-container">
      <h2 className="burn-title">Burn DPIT</h2>
      <input
        type="text"
        className="burn-input"
        placeholder="Enter DPIT Amount"
        value={dpitAmount}
        onChange={(e) => setDpitAmount(e.target.value)}
      />
      <button className="burn-button" onClick={handleBurn}>Burn</button>
    </div>
  );
};

export default Burn;
