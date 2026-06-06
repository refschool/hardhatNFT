import { existsSync } from "node:fs";
import { network } from "hardhat";

if (existsSync(".env")) {
    process.loadEnvFile(".env");
}

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (value === undefined || value.trim() === "") {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function buildTokenURI(baseURI: string, metadataId: number, extension: string): string {
    const normalizedBaseURI = baseURI.endsWith("/")
        ? baseURI.slice(0, -1)
        : baseURI;

    return `${normalizedBaseURI}/${metadataId}${extension}`;
}

async function main() {
    const contractAddress =
        process.env.CATS_ARMY_ADDRESS ?? "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const mintCount = Number(process.env.MINT_COUNT ?? "3");
    const metadataStartId = Number(process.env.METADATA_START_ID ?? "1");
    const metadataExtension = process.env.METADATA_EXTENSION ?? ".json";
    const ipfsBaseURI = getRequiredEnv("IPFS_BASE_URI");

    const { ethers } = await network.create();
    const [deployer] = await ethers.getSigners();
    const player = process.env.NFT_OWNER ?? (await deployer.getAddress());
    const catsArmy = await ethers.getContractAt("CatsArmy", contractAddress);

    for (let i = 0; i < mintCount; i++) {
        const metadataId = metadataStartId + i;
        const tokenURI = buildTokenURI(ipfsBaseURI, metadataId, metadataExtension);

        const tokenId = await catsArmy.awardItem.staticCall(player, tokenURI);
        const tx = await catsArmy.awardItem(player, tokenURI);
        await tx.wait();

        console.log(`NFT minted: token ID ${tokenId.toString()} to ${player}`);
        console.log(`Token URI: ${tokenURI}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
