import {ethers, providers} from "ethers";
import abi from "./abi.json";

const RPC = "https://polygon.llamarpc.com";
const BOOKERS_CONTRACT_ADDRES = "0xfEEE476CFaf56c2f359A63500415d5a2c7F2F2B9";

const RPC_PROVIDER = new providers.JsonRpcProvider(RPC);

const BOOKERS_WITH_RPC = new ethers.Contract(
    BOOKERS_CONTRACT_ADDRES,
    abi,
    RPC_PROVIDER
);


export const checkHolders = async (wallet:string) => {
    const tx = await BOOKERS_WITH_RPC.balanceOf(wallet);
    /*await tx.wait();*/
    return Number(tx) > 0;
}