let web3;
let contract;
const contractAddress = '0xE1Bb332600202b2E93A7CD84540513e9c949397E';
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "energy",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carbon",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "monthIndex",
				"type": "uint256"
			}
		],
		"name": "EnergyConsumed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "monthIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RewardClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "userId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "userName",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "carbonEmissionFactor",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimReward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getConsumptionRecord",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getConsumptionRecordCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPreviousMonthIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hasSubmittedForMonth",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "isEligibleForReward",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_energy",
				"type": "uint256"
			}
		],
		"name": "logEnergyConsumption",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextUserId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userName",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rewardClaimed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userConsumptionRecords",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "energyConsumption",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "carbonEmission",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "monthIndex",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "userId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "walletAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "userName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "householdSize",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalEnergyConsumption",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalCarbonEmission",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function getPreviousMonthIndex() {
    const now = new Date();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 12 : now.getMonth();
    return year * 100 + month;
}

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        document.getElementById("walletAddress").innerText = "錢包地址：" + accounts[0];
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("請安裝 MetaMask。");
    }
}

async function registerUser() {
    const name = document.getElementById("userName").value;
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.registerUser(name).send({ from: accounts[0] });
        alert("註冊成功！");
    } catch (err) {
        console.error(err);
        alert("註冊失敗：" + err.message);
    }
}

async function logEnergy() {
    const energy = document.getElementById("energyInput").value;
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.logEnergyConsumption(energy).send({ from: accounts[0] });
        alert("電量已提交！");
    } catch (err) {
        console.error(err);
        alert("提交失敗！");
    }
}

async function getEmissions() {
    const input = document.getElementById("queryAddress").value.trim();
    const accounts = await web3.eth.getAccounts();
    const target = input || accounts[0];

    if (!web3.utils.isAddress(target)) {
        alert("請輸入合法的以太坊地址！");
        return;
    }

    try {
        const user = await contract.methods.users(target).call();
        if (user.userId == 0) {
            document.getElementById("emissionsResult").innerText = `地址 ${target} 尚未註冊，無碳排放資料`;
        } else {
            document.getElementById("emissionsResult").innerText =
                `使用者 ${user.userName} 的總碳排放為：${user.totalCarbonEmission} 克`;
        }
    } catch (error) {
        console.error(error);
        alert("查詢失敗：" + (error.message || "不明錯誤"));
    }
}

async function getAllConsumption() {
    const input = document.getElementById("historyAddress").value.trim();
    const accounts = await web3.eth.getAccounts();
    const userAddr = input || accounts[0];

    if (!web3.utils.isAddress(userAddr)) {
        alert("請輸入合法的以太坊地址！");
        return;
    }

    try {
        const count = await contract.methods.getConsumptionRecordCount(userAddr).call();
        if (count == 0) {
            document.getElementById("historyResult").innerText = "此地址沒有任何用電紀錄。";
            return;
        }

        let html = `<table border=\"1\"><tr><th>年份</th><th>月份</th><th>用電量 (kWh)</th><th>碳排放 (g)</th><th>是否符合平均 (120)</th></tr>`;
        let hasValidData = false;

        for (let i = 0; i < count; i++) {
			const rec = await contract.methods.getConsumptionRecord(userAddr, i).call();

			const timestamp = rec[0];
			const energy = rec[1];
			const carbon = rec[2];

			if (!timestamp || timestamp == 0) {
				continue;
			}

			const date = new Date(timestamp * 1000);
			const year = date.getFullYear();
			const month = date.getMonth();
			const meets = energy < 120 ? '是' : '否';

			html += `<tr>
				<td>${year}</td>
				<td>${month} </td>
				<td>${energy}</td>
				<td>${carbon}</td>
				<td>${meets}</td>
			</tr>`;
			hasValidData = true;
		}
        html += "</table>";

        if (hasValidData) {
            document.getElementById("historyResult").innerHTML = html;
        } else {
            document.getElementById("historyResult").innerHTML = "查無有效用電紀錄。";
        }
    } catch (error) {
        console.error(error);
        alert("查詢失敗：" + (error.message || "不明錯誤"));
    }
}

async function claimReward() {
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];
    const monthIndex = getPreviousMonthIndex();

    try {
        const alreadyClaimed = await contract.methods.rewardClaimed(user, monthIndex).call();
        if (alreadyClaimed) {
            document.getElementById("rewardResult").innerText = "已領取上個月的獎勵，請下個月再來。";
            return;
        }

        const eligible = await contract.methods.isEligibleForReward(user).call();
        if (!eligible) {
            document.getElementById("rewardResult").innerText = "不符合上個月獎勵資格或已領取過獎勵。";
            return;
        }

        await contract.methods.claimReward().send({ from: user });
        document.getElementById("rewardResult").innerText = "恭喜！已領取 0.01 ETH 獎勵。";
    } catch (err) {
        console.error(err);
        alert("領取失敗：" + (err.message || "不明錯誤"));
    }

}

async function connectWallet() {
		if (window.ethereum) {
			web3 = new Web3(window.ethereum);
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const accounts = await web3.eth.getAccounts();
			const userAddress = accounts[0];
			document.getElementById("walletAddress").innerText = "錢包地址：" + userAddress;
			contract = new web3.eth.Contract(contractABI, contractAddress);

			// 檢查是否已註冊過
			try {
				const userInfo = await contract.methods.users(userAddress).call();
				if (userInfo.userId != 0) {
					document.getElementById("welcomeMessage").innerText =
						`🎉 歡迎回來，${userInfo.userName}！`;
				} else {
					document.getElementById("welcomeMessage").innerText = '';
				}
			} catch (err) {
				console.error("無法取得使用者資料", err);
			}
		} else {
			alert("請安裝 MetaMask。");
		}
}

async function showUserStats() {
    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    try {
        const userInfo = await contract.methods.users(user).call();
        const totalEnergy = userInfo.totalEnergyConsumption;
        const recordCount = await contract.methods.getConsumptionRecordCount(user).call();

        const avgEnergy = recordCount > 0 ? (totalEnergy / recordCount).toFixed(2) : 0;

        document.getElementById("userStatsResult").innerText = 
            `總用電量：${totalEnergy} kWh，平均每次紀錄用電量：${avgEnergy} kWh/月`;
    } catch (err) {
        console.error(err);
        document.getElementById("userStatsResult").innerText = "查詢失敗：" + (err.message || "未知錯誤");
    }
}
