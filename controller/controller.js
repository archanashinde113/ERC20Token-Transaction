
const Details = require('../Model/model')
const dotenv = require('dotenv')
 dotenv.config();
const Web3 = require('web3');
const express = require('express');
const request = require('request');

const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9cc53a94cc4a42b793e399fd8b0d5755'));
const abi = [
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
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "delegate",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"name": "delegate",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "numTokens",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenOwner",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "numTokens",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "numTokens",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const contractAddress = process.env.contractAddress;
const contract = new web3.eth.Contract(abi,contractAddress);
app.use(express.json());
const Tx = require('ethereumjs-tx').Transaction;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());


module.exports = {
    totalSupply : function (req, res) {
       contract.methods.totalSupply().call().then((result) => {
            res.send(result)
        }).catch((err) => {
            res.send(err);
        });
    },
    balanceOf : function (req, res) {
        contract.methods.balanceOf(senderAddress=req.body.senderAddress).call(function (err, res) {
            if (err) {
              console.log("An error occured", err)
              return
            }
            console.log("The balance is: ", res)
            //res.json(balance)
          })
          
    },
    transfer :  (req, res) =>{
		const MainAccountAddress = req.body.MainAccountAddress; //from
		const toAddress = req.body.toAddress; //to
		const value = req.body.value;
		const MainAccountPrivateKey = process.env.MainAccountPrivateKey;
		async function TransferERC20Token(toAddress, value) {
			return new Promise(function (resolve, reject) {
				try {
					web3.eth.getBlock("latest", false, (error, result) => {
						var _gasLimit = result.gasLimit;
						// let contract = new web3.eth.Contract(contractABI, contractAddress);
		
						contract.methods.decimals().call().then(function (result) {
							try {
								var decimals = result;
								let amount = parseFloat(value) * Math.pow(10, decimals);
								web3.eth.getGasPrice(function (error, result) {
									let _gasPrice = result;
									try {
										const privateKey = Buffer.from(MainAccountPrivateKey, 'hex')
										var _hex_gasLimit = web3.utils.toHex((_gasLimit + 1000000).toString());
										var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());
										var _hex_value = web3.utils.toHex(amount.toString());
										var _hex_Gas = web3.utils.toHex('60000');
				
										web3.eth.getTransactionCount(MainAccountAddress).then(
											nonce => {
												var _hex_nonce = web3.utils.toHex(nonce); 
												const rawTx =
												{
													nonce: _hex_nonce,
													from: MainAccountAddress,
													to: toAddress,
													gasPrice: _hex_gasPrice,
													gasLimit: _hex_gasLimit,
													gas: _hex_Gas,
													value: '0x0',
													data: contract.methods.transfer(toAddress, _hex_value).encodeABI()
												};
		
												const tx = new Tx(rawTx, { 'chain': 'ropsten' });
												tx.sign(privateKey);
												var serializedTx = '0x' + tx.serialize().toString('hex');
												web3.eth.sendSignedTransaction(serializedTx.toString('hex'), function (err, hash) {
													if (err) {
														reject(err);
													}
													else {
														resolve(hash);
														console.log(hash)
														res.status(200).json(rawTx);
														let transactionDetails = new Details({
															from:rawTx.from,
															to:rawTx.to,
															value:rawTx.value,
															data:rawTx.data,
															hash:hash
														})
														 transactionDetails.save();
													}
												})
											});                                
									} catch (error) {
										reject(error);
									}
								});
							} catch (error) {
								reject(error);
							}
						});
					});
				} catch (error) {
					reject(error);
				}
			})
		}
		TransferERC20Token(toAddress, value);},
approve : function (req, res) {
    const delegate = req.body.delegate;
    const numTokens = req.body.numTokens;
    contract.methods.approve(delegate, numTokens).call().then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err)
    });
},

alltransction:  function(req,res)  {
	const address = req.body.address;
    const API_KEY = process.env.API_KEY;
   request(`https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${API_KEY}`, function (error, response,body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode);
  console.log('body:', JSON.parse(body));
  res.status(200).json(JSON.parse(body))
  const alltransactionSave = new Details(
	 {alltransaction:JSON.parse(body)},
	
	 );
 alltransactionSave.save();
 
});
 


// Details.find({}) 
// .then((transactions) => { for (const value of transactions) 
// 	{ totalNumofTransactionsForAverage++; totalGasValueForAverage = (totalGasValueForAverage+value.dbGasUsed); } 
// 	// TODO: NEED TO FIGURE OUT HOW TO STORE THIS VARIABLE FOR USE ON PAGE. 
// 	totalAverageGasValueToDisplay = totalGasValueForAverage/totalNumofTransactionsForAverage; });
},

allowance : function (req, res) {
    const owner = req.body.owner;
    const delegate = req.body.delegate;
    contract.methods.allowance(owner,delegate).call().then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err)
    });
}

}