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

import { Container } from '@mui/material';
import PageHeader from '@/components/Headers/PageHeader';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Terminal from 'react-console-emulator';
import { ellipseAddress } from '@/utils/ellipseAddress';
import { ChainType } from '@/models/Chain';
import { getAlgoRealmHistory } from '@/utils/transactions/getAlgoRealmHistory';
import { getAlgoRealmCalls } from '@/utils/transactions/getAlgoRealmCalls';
import {
  ALGOREALM_CROWN_ID,
  ALGOREALM_POEM,
  ALGOREALM_SCEPTRE_ID,
  CONNECTED_WALLET_TYPE,
} from '@/common/constants';
import { ConnectContext } from '@/redux/store/connector';
import { WalletType } from '@/models/Wallet';
import {
  getAccountAssets,
  onSessionUpdate,
  switchChain,
} from '@/redux/slices/walletConnectSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { optAssets } from '@/redux/slices/walletConnectSlice';
import { getClaimAssetTxns } from '@/utils/transactions/getClaimAssetTxns';
import submitTransactions from '@/utils/transactions/submitTransactions';
import { hasAsset } from '@/utils/assets/hasAsset';

const Console = () => {
  const dispatch = useAppDispatch();
  const connector = useContext(ConnectContext);
  const [isConnected, setIsConnected] = useState(false);

  const { address, gateway, chain, assets } = useAppSelector(
    (state) => state.walletConnect,
  );

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

      setIsConnected(true);
    },
    [connector, dispatch],
  );

  const disconnect = async () => {
    await connector
      .disconnect()
      .catch((err: { message: any }) => console.error(err.message));

    setIsConnected(false);
  };

  const loadHistory = async () => {
    const attempts = 1;
    let algoRealmCalls = [] as Record<string, any>[];
    while (attempts <= 5) {
      try {
        algoRealmCalls = await getAlgoRealmCalls(chain);
        break;
      } catch (e) {
        console.log(e);
      }
    }

    return getAlgoRealmHistory(algoRealmCalls);
  };

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
    'change-chain': {
      description: `Change chain`,
      usage: `change-chain mainnet|testnet`,
      fn: (chain: ChainType) => {
        dispatch(switchChain(chain));
        return `Chain changed to ${chain}`;
      },
    },
    'claim-crown': {
      description: `Claim the Crown of Entropy, become the Randomic Majesty of Algorand.`,
      usage: `claim-crown <majesty-name> <algos>`,
      fn: async (...args: string[] | any[]) => {
        if (args.length !== 2) {
          return `Invalid number of arguments. Expected 2, got ${args.length}.`;
        }

        const majestyName = args[0];
        const algos = Number(args[1]) * 1e6;

        if (!connector.connected) {
          return `You must connect to PeraWallet to claim the Crown of Entropy.`;
        }

        if (hasAsset(ALGOREALM_CROWN_ID(chain), assets)) {
          await dispatch(
            optAssets({
              assetIndexes: [ALGOREALM_CROWN_ID(chain)],
              gateway,
              connector,
            }),
          );
        }

        const claimTxns = await getClaimAssetTxns(
          chain,
          address,
          ALGOREALM_CROWN_ID(chain),
          `Crown`,
          majestyName,
          algos,
        );

        const signedTxns = await connector.signTransactions(claimTxns);

        if (!signedTxns) {
          return undefined;
        }

        const txnResponse = await submitTransactions(chain, signedTxns);

        return `Transactions ${txnResponse.txId} performed. 👑 Glory to ${majestyName}, the Randomic Majesty of Algorand! 🎉`;
      },
    },
    'claim-sceptre': {
      description: `Claim the Sceptre of Proof, become the Verifiable Majesty of Algorand`,
      usage: `claim-sceptre <majesty-name> <algos>`,
      fn: async (...args: string[] | any[]) => {
        if (args.length !== 2) {
          return `Invalid number of arguments. Expected 2, got ${args.length}.`;
        }

        const majestyName = args[0];
        const algos = Number(args[1]) * 1e6;

        if (!connector.connected) {
          return `You must connect to PeraWallet to claim the Sceptre of Proof.`;
        }

        if (!hasAsset(ALGOREALM_SCEPTRE_ID(chain), assets)) {
          await dispatch(
            optAssets({
              assetIndexes: [ALGOREALM_SCEPTRE_ID(chain)],
              gateway,
              connector,
            }),
          );
        }

        const claimTxns = await getClaimAssetTxns(
          chain,
          address,
          ALGOREALM_SCEPTRE_ID(chain),
          `Crown`,
          majestyName,
          algos,
        );

        const signedTxns = await connector.signTransactions(claimTxns);

        if (!signedTxns) {
          return undefined;
        }

        const txnResponse = await submitTransactions(chain, signedTxns);

        return `Transactions ${txnResponse.txId} performed. 👑 Glory to ${majestyName}, the Verifiable Majesty of Algorand! 🎉`;
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
          return `You are already logged out!`;
        }
        disconnect();
      },
    },
  };

  const customPromptLabel = useMemo(() => {
    return isConnected
      ? `(${ellipseAddress(address, 4)})|${chain}$➜`
      : `[${chain}]$➜`;
  }, [address, chain, isConnected]);

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

      <Container component="main" sx={{ pt: 5 }}>
        <Terminal
          style={{
            backgroundColor: `#222222`,
          }} // Terminal background
          contentStyle={{ color: `#35f200` }} // Text colour
          promptLabelStyle={{ color: `#FFFFFF` }} // Prompt label colour
          inputTextStyle={{ color: `white` }} // Prompt text colour
          commands={commands}
          welcomeMessage={`Welcome to the AlgoRealm v0.1.0 👑`}
          promptLabel={customPromptLabel}
        />
      </Container>
    </div>
  );
};

export default Console;
