const contractAddress = "0xFeDFAF1A10335448b7FA0268F56D2B44DBD357de";
const provider = "https://opt-mainnet.g.alchemy.com/v2/Lv1e8zjq1z1tonwU-dPG0fVWmSTQHS9O";
const Web3 = require("web3");
const web3 = new Web3(provider);
const contract = new web3.eth.Contract([{
    "inputs": [{
     "internalType": "uint256",
     "name": "index",
     "type": "uint256"
    }, {
     "internalType": "address",
     "name": "account",
     "type": "address"
    }, {
     "internalType": "uint256",
     "name": "amount",
     "type": "uint256"
    }, {
     "internalType": "bytes32[]",
     "name": "merkleProof",
     "type": "bytes32[]"
    }],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}],contractAddress);

(async function(){
    const account = await web3.eth.accounts.privateKeyToAccount("d03273f4ce633f6a4636adb8bf250e630c7454a361571f4a73dfd1f80a04091e");
    const transaction = contract.methods.claim(159270,"0xA7990D2F4070355706ee232b7f2E39B31E9fa83E","0x2a1d334dcadf740000",["0x2978dcf689946dc47f53e01e3f4b3547d22a05312e8e33104c64b52c5ed2ac00","0x2c943c9fc77ef01179448e0e9d28a65225bb8adc0963cda0cc72775d830b5453","0xbf9d163bfa80841db52a39381789701205ebc3e5baa22e9f0c3ce1fa13f70e92","0x85072eb57b29a383df9a8806219c3e91f173861a371e5e739b342feeec40f198","0x1135e1c3fd4761ebe2abcf2c8cfd40fcf92d01c3415257c35f3912adecc51439","0xf248d8c8719d35594abdba7587d05a2181cc1929764bcbb83ba35962d6a78337","0x3145b8248f0a69620437eb4868a3119572bad60cf65510b7addb5fcb77341e51","0x84f4787edb0d8f15544b0718fd553216dd5af3909bd7cc52fec94749ad57b943","0x2c16cf66edfc89fa7bae99f2ecb8d8b50f0e6001c3462a16941310dd6a7e08ea","0x36d8cef95f4a4dabf2a1cc5e171ff6d29d0dc2ab283acab850a89cd852669f38","0xd67af2fa5b1e4ad85cde30addf5968f76ae9660803f94151549729bd922d6e50","0xdc49065e21a25f6d3463fe80e015fcd3f615564405db1e5a96459eb71b08ba40","0x13523e64678c42181ec1f8038f09ebdc2b54a63501edf4c8bd8ce3185f1df711","0xaab06430a46d5f6fe6dd2c5132483c3a6613a0fb028db4aa958cb804b5bdbcee","0x2abe2b7a7d56d1ac081befd5592158abed7594b3fd93aae8e030b7f1d0cb33ad","0xffe7054f0becad2d7babb2a90701ae2cc99d5c66a6e1e0723f09a9a6cecded04","0x497a97e1da389330652207b3b17baceed3dac9538dacceac1ba6a7f74fca4101","0x52044ff4e7c1d5d3a1a493a9e16f6ff1e909d6b4515d0da464811141abc8ce71"]);
    const gasInNeed = await transaction.estimateGas({from:account.address,gas:10**10});
    console.log(`gasInNeed:${gasInNeed}`);
    const tx = {
        gas: Number(gasInNeed),
        data: transaction.encodeABI(),
        to: contractAddress,
        gasPrice:10 ** 10
    }
    const signedTransaction = await account.signTransaction(tx);
    await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction).on('receipt',(e)=>{console.log(e);console.log("Success!");});
})()
