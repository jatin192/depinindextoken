# Depinindextoken

## Live Daap : https://depinindextoken.netlify.app/ 
#### Testnet : Sepolia Ethereum
#### Language : Solidity
#### Addresses
    TokenA		        = 	0x321753426b259417fB15a594FBAf1487814A4334
    TokenB 		        = 	0xB853AeB2f29fDE64676Ad83Ee81cDA6955b1f344
    TokenC 		        = 	0x558403FE5FCBc91B84bE402BC6C23f1F2E2E9165
    DePINIndexToken  	= 	0xEA9E46A21CceA6C2992Af045b723A7fF2A3edF91     
## Folder structure
```bash
  src/
  ├── App.jsx
  ├── components/
  │   ├── Mint.jsx
  │   ├── Burn.jsx
  │   ├── Stake.jsx
  │   ├── Navbar.jsx
  │   ├── Withdraw.jsx
  │   ├── Info.jsx
```

## Workflow
### 1. Create ERC20 Contracts for TokenA, TokenB, and TokenC:
 First, you'll need to deploy three ERC20 contracts representing TokenA, TokenB, and TokenC. 


 ```bash
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract CustomERC20 is ERC20 
{
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) 
    {
          _mint(msg.sender, initialSupply * (10 ** decimals())); // Mint initial supply to deployer
    }
}
``` 
### Deployment Steps:
 Deploy this contract three times with different names, symbols, and initial supplies:
     
     TokenA: Name = "TokenA", Symbol = "TKA", Initial Supply = 10000
    
     TokenB: Name = "TokenB", Symbol = "TKB", Initial Supply = 10000
    
     TokenC: Name = "TokenC", Symbol = "TKC", Initial Supply = 10000
 
### After Deployment:
 Note the contract addresses for each token. You will need to use these addresses when deploying your DePINIndexToken contract.

### 2.   Deploy the DePINIndexToken Contract:
 Deploy the DePINIndexToken contract by passing the addresses of TokenA, TokenB, and TokenC from the previous step as constructor arguments.

## Demonstration Steps
Once the contract is deployed successfully on Remix, you can start calling the functions. Below is a step-by-step guide on how to demonstrate the functionalities with inputs and expected 

outputs:
### 1. Minting DPIT Tokens

![Screenshot from 2024-08-29 02-27-25](https://github.com/user-attachments/assets/16fc0002-6693-41f5-b7fb-5e729a723586)

  ● Function: mint(uint256 amountA, uint256 amountB, uint256 amountC)
 
  ● Input: You need to approve the DePINIndexToken contract to spend your tokens before calling the mint function. Do this by using the approve function of TokenA, TokenB, and TokenC.

 Example:

 ● Approve: Call approve("DePINIndexToken_address", 1000) on TokenA, TokenB, and TokenC.

 ● Input Values: mint(400, 300, 300)

 ● Expected Output: After minting, you should receive 1000 DPIT tokens because you have deposited the tokens in the 40%:30%:30% ratio.

 ● Verification: Call balanceOf("your_address") on DePINIndexToken to check your DPIT balance, which should be 1000.

### 2. Burning DPIT Tokens
![Screenshot from 2024-08-29 02-28-45](https://github.com/user-attachments/assets/355ac040-16e3-46e2-88f0-b4303e5f03f2)

 ● Function: burn(uint256 dpitAmount)

 ● Input: burn(1000)

 ● Expected Output: You will burn 1000 DPIT tokens and receive back 400 TokenA, 300 TokenB, and 300 TokenC.

 ● Verification: Call balanceOf("your_address") on TokenA, TokenB, and TokenC to check that your balances have increased by 400, 300, and 300, respectively.

### 3. Staking DPIT Tokens


![Screenshot from 2024-08-29 02-29-22](https://github.com/user-attachments/assets/dd780f23-1356-45e0-b300-9450172370a8)

 ● Function: stake(uint256 dpitAmount)
 
 ● Input: stake(500)

 ● Expected Output: Your 500 DPIT tokens will be staked, and your DPIT balance will decrease by 500.
 
 ● Verification: Call stakes("your_address") to verify your staked amount and the start time of the stake.

### 4. Withdrawing Staked Tokens with Penalty


# ![Screenshot from 2024-08-29 02-29-58](https://github.com/user-attachments/assets/d7983938-0445-48cf-8174-ab1875926c32)


 ● Function: withdrawStake()
 
 ● Scenario: You withdraw early (e.g., after 10 days)
 
 ● Expected Output: You should receive your staked DPIT minus a penalty. For instance, after 10 days, the penalty would be calculated as 20% of the staked amount (30% on Day 1, decreasing by 1% daily). So, for 500 DPIT staked, the penalty will be 500 * 20% = 100 DPIT.
 
 ● Result: You will receive 400 DPIT back after the penalty is deducted.

 ● Verification: Check your DPIT balance to see the final amount after penalty deduction.

### 5. Withdrawing Staked Tokens After Full Duration

 ● Function: withdrawStake()
 
 ● Scenario: You withdraw after 30 days.
 
 ● Expected Output: You will receive your staked DPIT plus a reward of 1% of the staked amount. For 500 DPIT staked, you will get 500 + 1% = 505 DPIT.
 
 ● Verification: Check your DPIT balance to see the final amount with rewards.

### 6. Mock Price Feed

 ● Function: getPriceFeed()

 ● Expected Output: The function will return the hardcoded prices for the underlying tokens:
 
       Price of TokenA: 100
      
       Price of TokenB: 200
       
       Price of TokenC: 300
 
 ● Verification: Call the function to verify these values.



## Connecting Metamask
#### Creating contract Instance
To Create Contract Instance we need
Contract Address
ABI (Application Binary Interface)
Signer
```bash
if(window.ethereum)
{
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider_.send("eth_requestAccounts",[]);
  // will open the Metamask automatically
  let signer_ =provider_.getSigner();
  let Contract_Instance = new ethers.Contract(Contract_Address,ABI,signer);
}
```
 ● Provider used read data from blockchain (read-only)
 ●  Signer used to sign transaction and ineract with blockchain

## Auto-Switch Metamask to Sepolia Network Before Connecting
```bash
if (chainId !== 11155111)   // Sepolia network ID
{
   await window.ethereum.request({
   method: 'wallet_switchEthereumChain',
   params: [{ chainId: ethers.utils.hexValue(Sepolia_Chain_ID) }],
}
```
![image](https://github.com/user-attachments/assets/82db2124-63a5-49f3-9218-d551bcf624e6)

## Handling Metamask Account and Network Changes
To ensure your dApp responds to changes in Metamask, you can use the following script. This will reload the page when the network or account changes, updating the displayed account information:

```bash
window.ethereum.on("chainChanged", () => {window.location.reload();});
window.ethereum.on("accountsChanged", () => {window.location.reload();})
```

## To run this Dapp  locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone  https://github.com/jatin192/depinindextoken.git
   ```

2. Install the required dependencies :

   ```bash
   cd depinindextoken
   npm install   
   ```
3. start the development server :

   ```bash
   npm run dev
   ```  

