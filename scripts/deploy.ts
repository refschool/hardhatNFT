import { network } from "hardhat";

async function main() {
    const { ethers } = await network.create();
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();

    const catsArmy = await ethers.deployContract("CatsArmy");

    await catsArmy.waitForDeployment();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#f9fafb" font-family="Arial" font-size="54">CatsArmy</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#facc15" font-family="Arial" font-size="38">#1</text></svg>`;
    const tokenURI =
        "data:application/json;base64," +
        Buffer.from(
            JSON.stringify({
                name: "CatsArmy #1",
                description: "First CatsArmy NFT minted on Hardhat.",
                image: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
            })
        ).toString("base64");

    const mintTx = await catsArmy.awardItem(deployerAddress, tokenURI);
    await mintTx.wait();

    console.log("CatsArmy deployed to:", await catsArmy.getAddress());
    console.log("NFT owner:", deployerAddress);
    console.log("NFT token ID:", 1);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
