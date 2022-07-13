const SBT = artifacts.require("SBT.sol");
const { expect } = require("chai");
const url = require("./../URI/saanhoiNFT");

contract("SBT",async accounts => {
    it("change success",async ()=>{
        const sbtInstance = await SBT.deployed();
        await sbtInstance.safeMint({from:accounts[0]});
        const init_uri = await sbtInstance.tokenURI(1);
        await sbtInstance.changeUri("https://gateway.pinata.cloud/ipfs/QmXCLebTudL4KnBFQFNWepj1csgQsJLgcjsnmFsPzWQya5/",{from:accounts[0]})
        const new_uri = await sbtInstance.tokenURI(1);
        expect(init_uri).equal("https://buidlers.community/api/sbt/1");
        expect(new_uri).equal("https://gateway.pinata.cloud/ipfs/QmXCLebTudL4KnBFQFNWepj1csgQsJLgcjsnmFsPzWQya5/1");
        try{
            await sbtInstance.safeMint({from:accounts[0]});
        }
        catch(e){
            expect(e);
        }
        await sbtInstance.addWhiteList(accounts[1],{from:accounts[0]});
        await sbtInstance.safeMint({from:accounts[1]});
        try{
            await sbtInstance.safeMint({from:accounts[0]});
        }
        catch (e){
            expect(e);
        }
        await sbtInstance.safeMint({from:accounts[1]});
        try{
            await sbtInstance.safeTransferFrom(accounts[0],accounts[1],1,{from:accounts[0]});
        }
        catch (e){
            expect(e);
        }
        const balanceOfAccount0 = await sbtInstance.balanceOf(accounts[0]);
        expect(balanceOfAccount0.toString()).equal("1");
        const sbtOfFirst = await sbtInstance.SBTOf(accounts[0]);
        expect(sbtOfFirst.toString()).equal("1");
        const sbtOfSecond = await sbtInstance.SBTOf(accounts[1]);
        expect(sbtOfSecond.toString()).equal("3");
    })
})