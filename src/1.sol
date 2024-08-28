/*       TokenA = 0x321753426b259417fB15a594FBAf1487814A4334
         TokenB = 0xB853AeB2f29fDE64676Ad83Ee81cDA6955b1f344
         TokenC = 0x558403FE5FCBc91B84bE402BC6C23f1F2E2E9165
DePINIndexToken = 0xEA9E46A21CceA6C2992Af045b723A7fF2A3edF91      */


// SPDX-License-Identifier: MITs
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DePINIndexToken is ERC20 {
    using SafeERC20 for IERC20;

    // Underlying tokens and their weights
    IERC20 public Token_A;
    IERC20 public Token_B;
    IERC20 public Token_C;
    
    // Fixed weights (in basis points for precision, i.e., 40% -> 4000 basis points)
    uint256 public constant WEIGHT_A = 4000; // 40%
    uint256 public constant WEIGHT_B = 3000; // 30%
    uint256 public constant WEIGHT_C = 3000; // 30%
    uint256 public constant BASIS_POINTS = 10000; // 100%

    // Staking and reward parameters
    uint256 public constant STAKE_DURATION = 30 days; // Lock period
    uint256 public constant STAKE_REWARD = 100; // 1% reward in basis points

    // Mapping for staker's info
    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => Stake) public stakes;
    address[] public stakers; // Array to keep track of all stakers

    // Constructor initializes the DePINIndexToken and sets the underlying tokens
    constructor(
        address _Token_A, 
        address _Token_B, 
        address _Token_C
    ) ERC20("DePIN Index Token", "DPIT") {
        Token_A = IERC20(_Token_A);
        Token_B = IERC20(_Token_B);
        Token_C = IERC20(_Token_C);
    }

    // Mint new DPIT tokens by depositing a basket of underlying tokens
    function mint(uint256 amountA, uint256 amountB, uint256 amountC) external {
        require(amountA > 0 && amountB > 0 && amountC > 0, "Invalid amounts");
        
        uint256 totalDeposit = amountA + amountB + amountC;
        
        // Check if the amounts are in the correct ratio
        require(amountA * BASIS_POINTS / totalDeposit == WEIGHT_A, "Invalid Token_A ratio");
        require(amountB * BASIS_POINTS / totalDeposit == WEIGHT_B, "Invalid Token_B ratio");
        require(amountC * BASIS_POINTS / totalDeposit == WEIGHT_C, "Invalid Token_C ratio");
        
        // Transfer underlying tokens to the contract
        Token_A.safeTransferFrom(msg.sender, address(this), amountA);
        Token_B.safeTransferFrom(msg.sender, address(this), amountB);
        Token_C.safeTransferFrom(msg.sender, address(this), amountC);
        
        // Mint DPIT tokens
        _mint(msg.sender, totalDeposit);
    }

    // Burn DPIT tokens to redeem underlying tokens
    function burn(uint256 dpitAmount) external {
        require(balanceOf(msg.sender) >= dpitAmount, "Insufficient DPIT balance");

        // Calculate amounts of underlying tokens to return based on weights
        uint256 amountA = dpitAmount * WEIGHT_A / BASIS_POINTS;
        uint256 amountB = dpitAmount * WEIGHT_B / BASIS_POINTS;
        uint256 amountC = dpitAmount * WEIGHT_C / BASIS_POINTS;

        // Burn DPIT tokens from the user
        _burn(msg.sender, dpitAmount);

        // Transfer the underlying tokens back to the user
        Token_A.safeTransfer(msg.sender, amountA);
        Token_B.safeTransfer(msg.sender, amountB);
        Token_C.safeTransfer(msg.sender, amountC);
    }

    // Stake DPIT tokens for a fixed period (30 days) to earn rewards
    function stake(uint256 dpitAmount) external {
        require(balanceOf(msg.sender) >= dpitAmount, "Insufficient DPIT balance");
        require(stakes[msg.sender].amount == 0, "Already staked"); // Only one stake at a time

        // Transfer DPIT to the contract and start the staking period
        _transfer(msg.sender, address(this), dpitAmount);
        stakes[msg.sender] = Stake({
            amount: dpitAmount,
            startTime: block.timestamp
        });
        stakers.push(msg.sender); // Add to list of stakers
    }

    // Withdraw staked tokens with rewards or penalty based on the staking duration
    function withdrawStake() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No active stake");

        // Calculate the number of days staked
        uint256 stakedDays = (block.timestamp - userStake.startTime) / 1 days;

        uint256 penalty;
        uint256 reward;
        
        if (stakedDays >= 30) {
            // Full reward if staked for the complete duration
            reward = userStake.amount * STAKE_REWARD / BASIS_POINTS;
        } else {
            // Early withdrawal, calculate linear penalty based on the staked days
            penalty = userStake.amount * (30 - stakedDays);
            penalty = penalty / 100;
        }

        uint256 payout = userStake.amount + reward - penalty;

        // Distribute penalty funds to remaining stakers
        distributePenalty(penalty);

        // Transfer the payout amount back to the user
        _transfer(address(this), msg.sender, payout);

        // Clear the stake
        delete stakes[msg.sender];
    }

    // Distribute penalty funds to remaining stakers
    function distributePenalty(uint256 penaltyAmount) internal {
        uint256 totalStaked = getTotalStaked();
        if (totalStaked == 0) return; // No stakers, nothing to distribute

        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            Stake storage stakerStake = stakes[staker];
            if (stakerStake.amount > 0) {
                uint256 stakerShare = stakerStake.amount * penaltyAmount / totalStaked;
                _transfer(address(this), staker, stakerShare);
            }
        }
    }

    // Get the total amount staked by all users
    function getTotalStaked() public view returns (uint256 total) {
        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            total += stakes[staker].amount;
        }
    }

    // Mock price feed, returns hardcoded prices for simplicity (can be replaced with actual price feeds)
    function getPriceFeed() external pure returns (uint256 priceA, uint256 priceB, uint256 priceC) {
        return (100, 200, 300); // Hypothetical prices for Token_A, Token_B, Token_C
    }
}
