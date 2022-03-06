const Saanhoi = artifacts.require("Saanhoi.sol");

module.exports = function(deployer){
    deployer.deploy(Saanhoi,"https://saanhoi.club/");
}