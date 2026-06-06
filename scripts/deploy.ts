import { network } from "hardhat";

async function main() {
    const { ethers } = await network.create();

    const catsArmy = await ethers.deployContract("CatsArmy");

    await catsArmy.waitForDeployment();

    console.log("CatsArmy deployed to:", await catsArmy.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
