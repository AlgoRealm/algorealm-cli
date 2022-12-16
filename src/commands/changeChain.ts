import { ChainType } from '@/models/Chain';
import { setChain } from '@/redux/slices/walletConnectSlice';
import store from '@/redux/store';

export const changeChain = (chain: ChainType) => {
  store.dispatch(setChain(chain));
  return `Chain changed to ${chain}`;
};
