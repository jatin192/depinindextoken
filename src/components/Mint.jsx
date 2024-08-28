import React, { useState } from 'react';
import './Mint.css'; // Import CSS for this component

const Mint = ({ contract }) => {
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [amountC, setAmountC] = useState('');

  const handleMint = async () => {
    if (contract) {
      try {
        let tx = await contract.mint(amountA, amountB, amountC);
        await tx.wait();
        alert("Mint successful");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="mint-container">
      <h2 className="mint-title">Mint DPIT</h2>
      <input
        type="text"
        className="mint-input"
        placeholder="Token A Amount"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
      />
      <input
        type="text"
        className="mint-input"
        placeholder="Token B Amount"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
      />
      <input
        type="text"
        className="mint-input"
        placeholder="Token C Amount"
        value={amountC}
        onChange={(e) => setAmountC(e.target.value)}
      />
      <button className="mint-button" onClick={handleMint}>
        Mint
      </button>
    </div>
  );
};

export default Mint;
