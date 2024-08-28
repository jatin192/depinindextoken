import React from 'react';
import './Withdraw.css'; // Import CSS for this component

const Withdraw = ({ contract }) => {
  const handleWithdraw = async () => {
    if (contract) {
      try {
        let tx = await contract.withdrawStake();
        await tx.wait();
        alert("Withdrawal successful");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="withdraw-container">
      <h2 className="withdraw-title">Withdraw Stake</h2>
      <button className="withdraw-button" onClick={handleWithdraw}>
        Withdraw
      </button>
    </div>
  );
};

export default Withdraw;
