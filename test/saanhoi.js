const Saanhoi = artifacts.require("Saanhoi.sol");

contract("Saanhoi",async accounts => {
    
    it("initial", async ()=>{
        const SaanhoiInstance = await Saanhoi.deployed();
        const balance = await web3.eth.getBalance(SaanhoiInstance.address);
        assert.equal(Number(balance),0)
    });

    it("URI Testing", async() => {
        const SaanhoiInstance = await Saanhoi.deployed();
        // const baseURIBeforeChange = await Saanhoi._baseURI().call();
        // setURI
        await SaanhoiInstance.setURI("https:Saanhoi.club");
    });
    
    it("Pause Testing", async() => {
        const SaanhoiInstance = await Saanhoi.deployed();

        //Pause 
        await SaanhoiInstance.pause({from:accounts[0]});

        const pauseEvnet = await SaanhoiInstance.getPastEvents("Paused");
        assert.equal(pauseEvnet.length,1);
        assert.equal(pauseEvnet[0].returnValues.account,accounts[0]);

        // Unpause
        await SaanhoiInstance.unpause({from:accounts[0]});

        const unpauseEvnet = await SaanhoiInstance.getPastEvents("Unpaused");
        assert.equal(unpauseEvnet.length,1);
        assert.equal(unpauseEvnet[0].returnValues.account,accounts[0]);
    })
})