import { useContext } from 'react';
import { Web3Context } from '../contexts/web3Authentication.contexts';

export const useAuth = () => useContext(Web3Context);
