/**
 * AlgoRealm
 * Copyright (C) 2022 AlgoWorld
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

import { Container } from '@mui/material';
import PageHeader from '@/components/Headers/PageHeader';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Terminal from 'react-console-emulator';
import { PeraWalletConnect } from '@perawallet/connect';
import { ellipseAddress } from '@/utils/ellipseAddress';
import { useSnackbar } from 'notistack';
import { indexerForChain } from '@/utils/algorand';
import { ChainType } from '@/models/Chain';
import { getAlgoRealmHistory } from '@/utils/getAlgoRealmHistory';
import { getAlgoRealmCalls } from '@/utils/getAlgoRealmCalls';
import {
  ALGOREALM_CROWN_ID,
  ALGOREALM_POEM,
  CONNECTED_WALLET_TYPE,
} from '@/common/constants';
import { optInAsset } from '@/utils/optInAsset';
import { ConnectContext } from '@/redux/store/connector';
import { WalletType } from '@/models/Wallet';
import {
  getAccountAssets,
  onSessionUpdate,
  switchChain,
} from '@/redux/slices/walletConnectSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';

const Console = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const connector = useContext(ConnectContext);

  const connect = useCallback(
    async (
      clientType: WalletType,
      fromClickEvent: boolean,
      phrase?: string,
    ) => {
      // MyAlgo Connect doesn't work if invoked oustide of click event
      // Hence this work around
      if (!fromClickEvent && clientType === WalletType.MyAlgoWallet) {
        return;
      }

      if (connector.connected) {
        const accounts = connector.accounts();
        accounts.length > 0
          ? dispatch(onSessionUpdate(accounts))
          : await connector.connect();
      } else {
        connector.setWalletClient(clientType, phrase);
        await connector.connect();
      }
    },
    [connector, dispatch],
  );

  const disconnect = async () => {
    await connector
      .disconnect()
      .catch((err: { message: any }) => console.error(err.message));
  };

  const loadHistory = async () => {
    const attempts = 1;
    let algoRealmCalls = [];
    while (attempts <= 5) {
      try {
        algoRealmCalls = await getAlgoRealmCalls();
        break;
      } catch (e) {
        console.log(e);
      }
    }

    return getAlgoRealmHistory(algoRealmCalls);
  };

  const { address, gateway, chain } = useAppSelector(
    (state) => state.walletConnect,
  );

  const commands = {
    about: {
      description: `About AlgoRealm`,
      fn: () => {
        return `AlgoRealm UI is an open-source terminal emulator web app built by @aorumbayev for the AlgoRealm CLI game created by @cusma. AlgoRealm UI is available under the GPLv3 license. CLI commands are identical to the original commands in the AlgoRealm documentation. However, they simplify the authentication and provide a higher degree of extensibility in the future. For more details, refer to https://github.com/cusma/algorealm - another fun way to play AlgoRealm that allows learning a few lower-level nuances of interacting with the Algorand blockchain.`;
      },
    },
    dynasty: {
      description: `Print entire AlgoRealm dynasty`,
      fn: async () => {
        return await loadHistory();
      },
    },
    poem: {
      description: `Prints a poem.`,
      link: `https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L70-L75`,
      fn: () => {
        return ALGOREALM_POEM;
      },
    },
    'claim-crown': {
      description: `Claim the Crown of Entropy, become the Randomic Majesty of Algorand.`,
      usage: `claim-crown <majesty-name> <algos>`,
      fn: async (...args) => {
        if (args.length !== 2) {
          return `Invalid number of arguments. Expected 2, got ${args.length}.`;
        }

        const majestyName = args[0];
        const algos = Number(args[1]);

        if (!connector.connected) {
          return `You must connect to PeraWallet to claim the Crown of Entropy.`;
        }

        return optInAsset(address, ALGOREALM_CROWN_ID, peraWallet);
      },
    },
    login: {
      description: `Login to PeraWallet | Print login status`,
      fn: () => {
        if (connector.connected) {
          return `You are already connected to PeraWallet: ${ellipseAddress(
            address,
            4,
          )}`;
        }

        connect(WalletType.PeraWallet, false);
      },
    },
    logout: {
      description: `Logout from PeraWallet`,
      fn: () => {
        if (!connector.connected) {
          return `You are already logged out: ${ellipseAddress(address, 4)}`;
        }
        disconnect();
      },
    },
  };

  const customPromptLabel = useMemo(() => {
    return address ? `(${ellipseAddress(address, 4)})$➜` : `➜`;
  }, [address]);

  useEffect(() => {
    const changeChain = (chain: ChainType) => {
      dispatch(switchChain(chain));
    };

    if (typeof window !== `undefined`) {
      const persistedChainType =
        chain !== undefined
          ? chain.toLowerCase() === `mainnet`
            ? ChainType.MainNet
            : ChainType.TestNet
          : (localStorage.getItem(`ChainType`) as ChainType) ??
            ChainType.TestNet;
      changeChain(persistedChainType);
    }

    const connectedWalletType = localStorage.getItem(CONNECTED_WALLET_TYPE);
    if (!connectedWalletType || connectedWalletType === ``) {
      return;
    } else {
      connect(connectedWalletType as WalletType, false);
    }

    if (address) {
      dispatch(getAccountAssets({ chain: chain, gateway, address }));
    }
  }, [dispatch, connector, address, chain, connect, gateway]);

  return (
    <div>
      <PageHeader
        title="🏰 AlgoRealm 👑"
        description="Claim the Crown and the Sceptre of Algorand Realm (CLI Emulator Edition)"
      />

      <Container component="main" sx={{ pt: 10 }}>
        <Terminal
          style={{
            backgroundColor: `#222222`,
          }} // Terminal background
          contentStyle={{ color: `#35f200` }} // Text colour
          promptLabelStyle={{ color: `#FFFFFF` }} // Prompt label colour
          inputTextStyle={{ color: `white` }} // Prompt text colour
          commands={commands}
          welcomeMessage={`Welcome to the AlgoRealm v0.1.0 👑 [mainnet ⚠️] `}
          promptLabel={customPromptLabel}
        />
      </Container>
    </div>
  );
};

export default Console;
