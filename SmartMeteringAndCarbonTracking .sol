// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SmartMeteringAndCarbonTracking {
    address public owner;
    uint256 public carbonEmissionFactor = 474; // 每 kWh 474 克

    struct User {
        uint256 userId;
        address walletAddress;
        string userName;
        uint256 householdSize;
        uint256 totalEnergyConsumption;
        uint256 totalCarbonEmission;
    }

    struct ConsumptionRecord {
        uint256 timestamp;
        uint256 energyConsumption;
        uint256 carbonEmission;
        uint256 monthIndex;
    }

    mapping(address => User) public users;
    mapping(address => ConsumptionRecord[]) public userConsumptionRecords;
    mapping(address => mapping(uint256 => bool)) public hasSubmittedForMonth;
    mapping(address => mapping(uint256 => bool)) public rewardClaimed;

    uint256 public nextUserId;

    event UserRegistered(uint256 indexed userId, address indexed walletAddress, string userName);
    event EnergyConsumed(address indexed userAddress, uint256 timestamp, uint256 energy, uint256 carbon, uint256 monthIndex);
    event RewardClaimed(address indexed userAddress, uint256 monthIndex, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function getPreviousMonthIndex() public view returns (uint256) {
        uint256 year;
        uint256 month;
        (year, month) = timestampToYearMonth(block.timestamp);
        if (month == 1) {
            year -= 1;
            month = 12;
        } else {
            month -= 1;
        }
        return year * 100 + month;
    }

    function timestampToYearMonth(uint256 timestamp) internal pure returns (uint256 year, uint256 month) {
        uint256 SECONDS_PER_DAY = 24 * 60 * 60;
        uint256 daysSinceEpoch = timestamp / SECONDS_PER_DAY;
        year = 1970 + daysSinceEpoch / 365;
        month = (daysSinceEpoch % 365) / 30 + 1;
        if (month > 12) month = 12;
    }

    function registerUser(string memory _userName) public {
        require(users[msg.sender].userId == 0, "User already registered");
        nextUserId++;
        users[msg.sender] = User(nextUserId, msg.sender, _userName, 0, 0, 0);
        emit UserRegistered(nextUserId, msg.sender, _userName);
    }

    function logEnergyConsumption(uint256 _energy) public {
        require(users[msg.sender].userId != 0, "User not registered");

        uint256 monthIndex = getPreviousMonthIndex();
        require(!hasSubmittedForMonth[msg.sender][monthIndex], "Already submitted for this month");

        uint256 carbon = _energy * carbonEmissionFactor;
        ConsumptionRecord memory record = ConsumptionRecord(block.timestamp, _energy, carbon, monthIndex);
        userConsumptionRecords[msg.sender].push(record);
        hasSubmittedForMonth[msg.sender][monthIndex] = true;

        users[msg.sender].totalEnergyConsumption += _energy;
        users[msg.sender].totalCarbonEmission += carbon;

        emit EnergyConsumed(msg.sender, block.timestamp, _energy, carbon, monthIndex);
    }

    function isEligibleForReward(address _user) public view returns (bool) {
        uint256 monthIndex = getPreviousMonthIndex();
        if (rewardClaimed[_user][monthIndex]) return false;

        ConsumptionRecord[] memory records = userConsumptionRecords[_user];
        uint256 totalEnergy = 0;
        uint256 count = 0;
        for (uint i = 0; i < records.length; i++) {
            if (records[i].monthIndex == monthIndex) {
                totalEnergy += records[i].energyConsumption;
                count++;
            }
        }
        if (count == 0) return false;
        return (totalEnergy / count) < 120;
    }

    function claimReward() public {
        require(isEligibleForReward(msg.sender), "Not eligible for reward");
        uint256 monthIndex = getPreviousMonthIndex();
        rewardClaimed[msg.sender][monthIndex] = true;
        emit RewardClaimed(msg.sender, monthIndex, 100 ether);
    }

    function getConsumptionRecord(address _user, uint256 _index) public view returns (uint256, uint256, uint256) {
        ConsumptionRecord memory rec = userConsumptionRecords[_user][_index];
        return (rec.timestamp, rec.energyConsumption, rec.carbonEmission);
    }

    function getConsumptionRecordCount(address _user) public view returns (uint256) {
        return userConsumptionRecords[_user].length;
    }

}