const Web3 = require('web3');
const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

async function check() {
    const data = web3.eth.abi.encodeFunctionCall({
        name: 'getProduct',
        type: 'function',
        inputs: [{ type: 'string', name: '_serialNumber' }]
    }, ['12345']);

    console.log("Calling getProduct('12345') payload:", data);
    try {
        const result = await web3.eth.call({
            to: '0x0C778A1762BEb8878947E56966E56EC8F476ebAc',
            data: data
        });
        console.log("Raw hex result:", result);
    } catch (e) {
        console.log("Call reverted:", e.message);
    }
}
check();
