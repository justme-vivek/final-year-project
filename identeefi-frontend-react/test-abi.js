const fs = require('fs');
const Web3 = require('web3');

async function test() {
    // 5-param ABI
    let abi5 = JSON.parse(fs.readFileSync('D:/vs-code/anti-counterfeit-product-identification-system-using-blockchain/identeefi-frontend-react/src/utils/Identeefi.json', 'utf8')).abi;
    
    // Construct 6-param ABI (with uint256 initialize_timestamp and uint256 expire_timestamp)
    let abi6 = JSON.parse(JSON.stringify(abi5));
    
    const getProd5 = abi5.find(x => x.name === 'getProduct');
    const getProd6 = abi6.find(x => x.name === 'getProduct');
    
    getProd6.outputs[5].components = [
        {"internalType":"uint256","name":"id","type":"uint256"},
        {"internalType":"string","name":"actor","type":"string"},
        {"internalType":"string","name":"location","type":"string"},
        {"internalType":"uint256","name":"initialize_timestamp","type":"uint256"},
        {"internalType":"uint256","name":"expire_timestamp","type":"uint256"},
        {"internalType":"bool","name":"isSold","type":"bool"}
    ];
    
    const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');
    const addr = '0x62081f016446585cCC507528cc785980296b4Ccd';
    
    try {
        console.log("Testing 5-param ABI...");
        const c5 = new web3.eth.Contract(abi5, addr);
        const res5 = await c5.methods.getProduct('12345').call();
        console.log("5-param success:", res5);
    } catch(e) {
        console.log("5-param failed:", e.message);
    }

    try {
        console.log("Testing 6-param ABI...");
        const c6 = new web3.eth.Contract(abi6, addr);
        const res6 = await c6.methods.getProduct('12345').call();
        console.log("6-param success:", res6);
    } catch(e) {
        console.log("6-param failed:", e.message);
    }
}
test();
