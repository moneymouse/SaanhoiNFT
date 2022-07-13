const Saanhoi = artifacts.require("Saanhoi.sol");
const url = require("./../URI/saanhoiNFT");

contract("Saanhoi",async accounts => {
    const ether = 10**18;

    it("initial", async ()=>{
        const SaanhoiInstance = await Saanhoi.deployed();
        const balance = await web3.eth.getBalance(SaanhoiInstance.address);
        const maxSupply = await SaanhoiInstance.maxTotalSupply();
        assert.equal(maxSupply.toNumber(),10000);
        assert.equal(Number(balance),0)
    });

    it("URI Testing", async() => {
        const SaanhoiInstance = await Saanhoi.deployed();
        // const baseURIBeforeChange = await Saanhoi._baseURI().call();
        // setURI
        await SaanhoiInstance.setURI("https://saanhoi.club/api/meta?id=",{from:accounts[0]});
    });

    it("White list mint test", async () => {
        const saanhoiInstance = await Saanhoi.deployed();

        try{
            await saanhoiInstance.toWHITELISTStage({from:accounts[1]});
        }
        catch (e){
            assert.equal(e.reason,"Ownable: caller is not the owner");
        }

        // set Whitelist stage
        await saanhoiInstance.toWHITELISTStage({from:accounts[0]});
        // add whitelist
        await saanhoiInstance.addWhiteListMember([accounts[1]],{from:accounts[0]});

        let balanceOfAccountOneBefore = await saanhoiInstance.balanceOf.call(accounts[1]);

        try{
            await saanhoiInstance.whiteListMint(3,{from:accounts[1],value:3*0.08*10**18});
        }
        catch(e){
            assert.equal(e.reason,"Saanhoi: Lack of times");
        }

        try{
            await saanhoiInstance.whiteListMint(1,{from:accounts[2],value:1*0.08*10**18});
        }
        catch (e){
            assert.equal(e.reason,"Saanhoi: Illegal members");
        }

        await saanhoiInstance.whiteListMint(2,{from:accounts[1],value:2*0.08*10**18});

        let balanceOfAccountOneAfter = await saanhoiInstance.balanceOf.call(accounts[1]);

        assert.equal(balanceOfAccountOneBefore.toNumber(),0);
        assert.equal(balanceOfAccountOneAfter.toNumber(),2);

        try{
            await saanhoiInstance.whiteListMint(1,{from:accounts[1],value: 0.08*10**18});
        }
        catch (e){
            assert.equal(e.reason,"Saanhoi: Lack of times");
        }

        try{
            await saanhoiInstance.mint(1,{from:accounts[1],value: 0.08*10**18});
        }
        catch (e){ assert.equal(e.reason,"Saanhoi: It's not right stage."); }

        let contractBalance = await web3.eth.getBalance(saanhoiInstance.address);
        console.log(contractBalance);
        assert.equal(contractBalance,2*0.08*10**18);

        let firstTokenId = await saanhoiInstance.tokenOfOwnerByIndex(accounts[1],0);
        assert.equal(firstTokenId.toNumber(),1);
        let tokenURIOfFirstTokenId = await saanhoiInstance.tokenURI(firstTokenId.toNumber());
        // setURI success
        assert.equal("https://saanhoi.club/api/meta?id=1",tokenURIOfFirstTokenId);
    });

    it("Public mint test", async () => {
        const saanhoiInstance  = await Saanhoi.deployed();
        // set Public stage
        await saanhoiInstance.toPUBLICStage({from:accounts[0]});

        let balanceOfAccountTwoBefore = await saanhoiInstance.balanceOf.call(accounts[2]);

        await saanhoiInstance.mint(1,{from:accounts[2],value: 0.08 * ether});

        try{
            await saanhoiInstance.mint(0,{from:accounts[1],value:0});
        }catch (e) {assert.equal(e.reason,"Saanhoi: Can't mint zero NFT");}

        await saanhoiInstance.mint(5,{from:accounts[2],value:5 * 0.08 * ether});
        try{
            await saanhoiInstance.mint(6,{from:accounts[1],value: 6 * 0.08 * ether});
        }catch (e) {assert.equal(e.reason,"Saanhoi: over batch")}

        // test payable
        try {
            await saanhoiInstance.mint(3,{from:accounts[1],value: 0.08 * ether});
        }catch (e) {assert.equal(e.reason,"Saanhoi: Lack of ETH");}

        let balanceOfAccountTwoAfter = await saanhoiInstance.balanceOf.call(accounts[2]);

        assert.equal(balanceOfAccountTwoBefore.toNumber(),0);
        assert.equal(balanceOfAccountTwoAfter.toNumber(),6);

        let contractBalance = await web3.eth.getBalance(saanhoiInstance.address);
        assert.equal(contractBalance, 8*0.08*10**18);
    });

    it("release test", async () => {
        const saanhoiInstance  = await Saanhoi.deployed();
        let accountBalanceBeforeRelease = await web3.eth.getBalance(accounts[0]);
        let contractBalanceBeforeRelease = await web3.eth.getBalance(saanhoiInstance.address);
        await saanhoiInstance.release({from:accounts[0]});
        let accountBalanceAfterRelease = await web3.eth.getBalance(accounts[0]);
        let contractBalanceAfterRelease = await web3.eth.getBalance(saanhoiInstance.address);
        assert.equal(contractBalanceBeforeRelease,8*0.08*ether);
        assert.equal(contractBalanceAfterRelease,0);
        accountBalanceBeforeRelease = new web3.utils.BN(accountBalanceBeforeRelease);
        contractBalanceBeforeRelease = new web3.utils.BN(contractBalanceBeforeRelease);
        // console.log(releaseGas);
        // assert.equal(accountBalanceAfterRelease,accountBalanceBeforeRelease.add(contractBalanceBeforeRelease).sub(releaseGas).toString());
        console.log(accountBalanceAfterRelease);
        console.log(accountBalanceBeforeRelease.add(contractBalanceBeforeRelease).toString());
        try{
            await saanhoiInstance.release({from:accounts[1]});
        }catch (e){
            assert.equal("Ownable: caller is not the owner",e.reason);
        }
    });

    it("Pause Testing", async() => {
        const SaanhoiInstance = await Saanhoi.deployed();

        //Pause
        await SaanhoiInstance.pause({from:accounts[0]});

        const pauseEvnet = await SaanhoiInstance.getPastEvents("Paused");
        assert.equal(pauseEvnet.length,1);
        assert.equal(pauseEvnet[0].returnValues.account,accounts[0]);

        try{
            await SaanhoiInstance.mint(1,{from:accounts[1],value:0.08*ether});
        }catch (e){ assert(e.reason,"Pausable: paused"); }

        // Unpause
        await SaanhoiInstance.unpause({from:accounts[0]});

        const unpauseEvnet = await SaanhoiInstance.getPastEvents("Unpaused");
        assert.equal(unpauseEvnet.length,1);
        assert.equal(unpauseEvnet[0].returnValues.account,accounts[0]);
    });
    it("Team Mint", async ()=>{
        const SaanhoiInstance = await Saanhoi.deployed();
        let teamQuota = await SaanhoiInstance.teamQuota.call();
        teamQuota = Number(teamQuota);
        console.log(teamQuota);
        try {
            await SaanhoiInstance.teamMint(1,{from:accounts[1]});
        }
        catch (e){ assert.equal(e.reason,"Ownable: caller is not the owner"); }
        try {
            await SaanhoiInstance.teamMint(teamQuota + 1,{from:accounts[0]});
        }
        catch (e){ assert.equal(e.reason,"Saanhoi: lack of quota"); }
        let balanceOfAccountZeroBefore = await SaanhoiInstance.balanceOf.call(accounts[0]);
        await SaanhoiInstance.teamMint(teamQuota,{from:accounts[0]});
        let balanceOfAccountZeroAfter = await SaanhoiInstance.balanceOf.call(accounts[0]);
        assert.equal(Number(balanceOfAccountZeroAfter) - Number(balanceOfAccountZeroBefore),teamQuota);
        try {
            await SaanhoiInstance.teamMint(3,{from:accounts[0]});
        }
        catch (e){ assert.equal(e.reason,"Saanhoi: lack of quota"); }
    })
});