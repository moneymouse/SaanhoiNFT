const SBT = artifacts.require("SBT");

module.exports = function(deployer){
    deployer.deploy(SBT,"https://contri.build/api/sbt/");
}
