import { providerOptions } from "./providerOptions";


export const createweb3Modal = {
    // network: "binance", // optional or "binance"
    cacheProvider: true, // optional
    providerOptions,
     chainId: 97,
    // chainId: 56,
    defaultChain: "binance",
    disableInjectedProvider: true,
};