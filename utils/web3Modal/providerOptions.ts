import WalletConnectProvider from "@walletconnect/web3-provider";
import { IProviderOptions } from "web3modal";

export const providerOptions: IProviderOptions = {
    /* See Provider Options Section */
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                97: "https://data-seed-prebsc-1-s3.binance.org:8545",
                // 56: "https://bsc-dataseed2.binance.org",
            }
            ,
            chainId: 97,
            // chainId: 56,
        },
    },
}