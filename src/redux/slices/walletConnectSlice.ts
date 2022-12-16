/**
 * AlgoRealm
 * Copyright (C) 2022 AlgoRealm
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { CHAIN_TYPE } from '@/common/constants';
import { Asset } from '@/models/Asset';
import { ChainType } from '@/models/Chain';
import getAssetsForAccount from '@/utils/accounts/getAssetsForAccount';

import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import optAssetsForAccount from '@/utils/assets/optAssetsForAccount';
import WalletManager from '@/wallets/walletManager';
import { IpfsGateway } from '@/models/Gateway';

interface WalletConnectState {
  chain: ChainType;
  accounts: string[];
  address: string;
  assets: Asset[];
  fetchingAccountAssets: boolean;
  gateway: IpfsGateway;
}

const initialState = {
  accounts: [],
  address: ``,
  assets: [
    {
      index: 0,
      amount: 0,
      creator: ``,
      frozen: false,
      decimals: 6,
      offeringAmount: 0,
      requestingAmount: 0,
      imageUrl: ``,
      name: `Algo`,
      unitName: `Algo`,
    },
  ],
  chain: CHAIN_TYPE,
  gateway: IpfsGateway.ALGONODE,
  fetchingAccountAssets: false,
} as WalletConnectState;

export const getAccountAssets = createAsyncThunk(
  `walletConnect/getAccountAssets`,
  async ({
    chain,
    address,
    gateway,
  }: {
    chain: ChainType;
    address: string;
    gateway: IpfsGateway;
  }) => {
    return await getAssetsForAccount(chain, address, gateway);
  },
);

export const optAssets = createAsyncThunk(
  `walletConnect/optAssets`,
  async (
    {
      assetIndexes,
      gateway,
      connector,
      deOptIn = false,
    }: {
      assetIndexes: number[];
      gateway: IpfsGateway;
      connector: WalletManager;
      deOptIn?: boolean;
    },
    { getState, dispatch },
  ) => {
    let state = getState() as any;
    state = state.walletConnect as WalletConnectState;

    return await optAssetsForAccount(
      state.chain,
      gateway,
      assetIndexes,
      connector,
      state.address,
      dispatch,
      deOptIn,
    );
  },
);

export const walletConnectSlice = createSlice({
  name: `walletConnect`,
  initialState,
  reducers: {
    setChain(state, action: PayloadAction<ChainType>) {
      if (action.payload && state.chain !== action.payload) {
        state.chain = action.payload;

        if (typeof window !== `undefined`) {
          localStorage.setItem(`ChainType`, action.payload);
        }
      }
    },
    setGateway: (state, action: PayloadAction<IpfsGateway>) => {
      state.gateway = action.payload;

      if (typeof window !== `undefined`) {
        localStorage.setItem(`IpfsGateway`, action.payload);
      }
    },
    reset: (state) => ({ ...initialState, chain: state.chain }),
    onSessionUpdate: (state, action: PayloadAction<string[]>) => {
      state.accounts = action.payload;
      state.address = action.payload[0];
    },
  },
  extraReducers(builder) {
    builder.addCase(getAccountAssets.fulfilled, (state, action) => {
      state.fetchingAccountAssets = false;
      state.assets = action.payload;
    });
    builder.addCase(getAccountAssets.pending, (state) => {
      state.fetchingAccountAssets = true;
    });
  },
});

export const selectAssets = createSelector(
  (state: RootState) => state.walletConnect.assets,
  (assets) => assets.map((a) => ({ ...a, amount: a.amount })),
);

export const { setChain, reset, onSessionUpdate, setGateway } =
  walletConnectSlice.actions;

export default walletConnectSlice.reducer;
