import { network } from "hardhat";

async function main() {
    const contractAddress =
        process.env.CATS_ARMY_ADDRESS ?? "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const mintCount = Number(process.env.MINT_COUNT ?? "3");

    const { ethers } = await network.create();
    const [deployer] = await ethers.getSigners();
    const player = await deployer.getAddress();
    const catsArmy = await ethers.getContractAt("CatsArmy", contractAddress);

    for (let i = 0; i < mintCount; i++) {
        const tokenNumber = i + 2;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#f9fafb" font-family="Arial" font-size="54">CatsArmy</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#facc15" font-family="Arial" font-size="38">#${tokenNumber}</text></svg>`;
        const tokenURI =
            "data:application/json;base64," +
            Buffer.from(
                JSON.stringify({
                    name: `CatsArmy #${tokenNumber}`,
                    description: `CatsArmy NFT #${tokenNumber} minted on Hardhat.`,
                    image: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
                })
            ).toString("base64");

        const tokenId = await catsArmy.awardItem.staticCall(player, tokenURI);
        const tx = await catsArmy.awardItem(player, tokenURI);
        await tx.wait();

        console.log(`NFT minted: token ID ${tokenId.toString()} to ${player}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
