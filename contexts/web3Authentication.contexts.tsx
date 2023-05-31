import {createContext, FC, ReactNode, useEffect, useReducer} from "react";
import {useRouter} from "next/router";
import {createweb3Modal} from "../utils/web3Modal/createWeb3Modal";
import Web3Modal from 'web3modal';
import { providers } from "ethers";
import {checkHolders} from "../utils/ethers";

export enum  WalletType{
    WalletConnect= "WalletConnect",
    InjectedEVM = "InjectedEVM",

}
export enum TypeAction {
    INITIALIZE = "INITIALIZE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
}
interface AuthState {
    // The website has been initialized and checked if user has cache
    isInitialized: boolean;
    // The user is authenticated successfully on our platform with web3
    isAuthenticated: boolean;
    // The user Wallet address, this value could be null if the user is unauthenticated.
    account: string | null;
    // This platform wallet type
    walletType: WalletType | null;
    // user wallet provider, this is used to send tx that the user should sign
    provider: any;
    //check if user is holder of bookers
    isHolder: boolean;
}


// this context value define the different functions that our systems provide in order to be able to easy get it from anywhere.
interface AuthContextValue extends AuthState{
    loginMetamask: () => Promise<void>;
    loginWalletConnect: () => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface Action {
    type: TypeAction,
    payload: Partial<AuthState>
}

const initialAuthState: AuthState = {
    account: null,
    isAuthenticated: false,
    isInitialized: false,
    provider: null,
    walletType: null,
    isHolder: false,
};

function reducer (state = initialAuthState, action: Action) {
    switch (action.type){
        case TypeAction.INITIALIZE:
            return Object.assign({},state, action.payload)
        case TypeAction.LOGIN:
            return Object.assign({},state, action.payload)
        case TypeAction.LOGOUT:
            return Object.assign({},state, action.payload)
        default:
            return state
    }
}

export const Web3Context = createContext<AuthContextValue>({
    ...initialAuthState,
    loginMetamask: () => Promise.resolve(),
    loginWalletConnect: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const {children} = props;

    const [state, dispatch] = useReducer(
        reducer,
        initialAuthState, undefined);
    //const {t} = useLocale();
    const router = useRouter();

    const initialization = async () => {

        // check EVM connection first
        const web3Modal = new Web3Modal(createweb3Modal);
        if (
            web3Modal &&
            web3Modal.cachedProvider &&
            window.ethereum &&
            window.ethereum.isConnected()
        ) {
            const provider = await web3Modal.connectTo('injected');
            await handleEvents(provider);
            const ethersProvider = new providers.Web3Provider(provider);
            const userAddress = await ethersProvider.getSigner().getAddress();
            const isHolder = await checkHolders(userAddress);
            dispatch({
                type: TypeAction.INITIALIZE,
                payload: {
                    isAuthenticated: true,
                    provider,
                    account: userAddress,
                    walletType: WalletType.InjectedEVM,
                    isHolder
                }
            });
        } else if (web3Modal && web3Modal.cachedProvider) {
            const provider = await web3Modal.connect();
            await handleEvents(provider);
            const ethersProvider = new providers.Web3Provider(provider);
            const userAddress = await ethersProvider.getSigner().getAddress();
            const isHolder = await checkHolders(userAddress);
            dispatch({
                type: TypeAction.INITIALIZE,
                payload: {
                    isAuthenticated: true,
                    provider,
                    account: userAddress,
                    walletType: WalletType.WalletConnect,
                    isHolder
                }
            });
        } else {
            dispatch({
                type: TypeAction.INITIALIZE,
                payload: {
                    isAuthenticated: false,
                    provider: null,
                    account: null,
                    walletType: null,
                }
            });
        }
        return {
            status: true,
        }
    }

    useEffect(()=>{
        if(router.isReady){
            initialization().then()
        }
    }, [router.isReady])
    const loginMetamask =async () => {

        const web3Modal = new Web3Modal(createweb3Modal);
        const provider = await web3Modal.connectTo('injected');
        const ethersProvider = new providers.Web3Provider(provider);
        const userAddress = await ethersProvider.getSigner().getAddress();
        const isHolder = await checkHolders(userAddress);
        dispatch({
            type: TypeAction.LOGIN,
            payload: {
                isAuthenticated: true,
                provider,
                account: userAddress,
                walletType: WalletType.InjectedEVM,
                isHolder
            }
        });
    }
    const loginWalletConnect = async () => {
        const web3Modal = new Web3Modal(createweb3Modal);
        const provider = await web3Modal.connect();
        const ethersProvider = new providers.Web3Provider(provider);
        const userAddress = await ethersProvider.getSigner().getAddress();
        const isHolder = await checkHolders(userAddress);
        dispatch({
            type: TypeAction.LOGIN,
            payload: {
                isAuthenticated: true,
                provider,
                account: userAddress,
                walletType: WalletType.WalletConnect,
                isHolder
            }
        });
    }
    const logout = async (): Promise<void> => {
        const web3Modal = new Web3Modal(createweb3Modal);
        web3Modal.clearCachedProvider();

        dispatch({
            type: TypeAction.LOGOUT,
            payload: {
                isAuthenticated: false,
                provider: null,
                account: null,
                walletType: null,
                isHolder: false
            }
        });
        router.push('/');
    };
    const handleEvents = async (provider: any) => {
        await provider.on("disconnect", () => {
            console.log("disconnect");
            logout();
        });
        await provider.on("accountsChanged", () => {
            console.log("accountsChanged");
        });
        await provider.on("chainChanged", () => {
            console.log("chainChanged");
        });
    }


    return   <Web3Context.Provider
        value={{
            ...state,
            loginMetamask,
            loginWalletConnect,
            logout,
        }}
    >
        {children}
    </Web3Context.Provider>;
}

