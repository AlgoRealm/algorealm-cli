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
import { CONNECTED_WALLET_TYPE } from '@/common/constants';
import { ConnectContext } from '@/redux/store/connector';
import { WalletType } from '@/models/Wallet';
import {
  getAccountAssets,
  onSessionUpdate,
  setChain,
  setGateway,
} from '@/redux/slices/walletConnectSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { changeChain } from '@/commands/changeChain';
import { changeGateway } from '@/commands/changeGateway';
import { IpfsGateway } from '@/models/Gateway';
import { getKeyByValue } from '@/utils/getKeyByValue';
import { claimSceptre } from '@/commands/claimSceptre';
import { claimCrown } from '@/commands/claimCrown';
import { about } from '@/commands/about';
import { printDynasty } from '@/commands/printDynasty';
import { printPoem } from '@/commands/printPoem';
import pJson from '@/package.json';

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

  const commands = {
    about: {
      description: `About AlgoRealm`,
      fn: about,
    },
    dynasty: {
      description: `Print entire AlgoRealm dynasty`,
      fn: async () => {
        return await printDynasty(chain);
      },
    },
    poem: {
      description: `Prints a poem.`,
      link: `https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L70-L75`,
      fn: printPoem,
    },
    'change-chain': {
      description: `Change chain`,
      usage: `change-chain mainnet|testnet`,
      fn: changeChain,
    },
    'change-gateway': {
      description: `Change gateway`,
      usage: `change-gateway dweb|ipfs|cloudflare|algonode`,
      fn: changeGateway,
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

        return await claimCrown(
          majestyName,
          algos,
          chain,
          address,
          assets,
          gateway,
          connector,
        );
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

        return await claimSceptre(
          majestyName,
          algos,
          chain,
          address,
          assets,
          gateway,
          connector,
        );
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
    const gatewayTitle = getKeyByValue(IpfsGateway, gateway).toLowerCase();
    return isConnected
      ? `(${ellipseAddress(address, 4)})•${chain}•${gatewayTitle}•$➜`
      : `[${chain}•${gatewayTitle}]➜`;
  }, [address, chain, isConnected, gateway]);

  useEffect(() => {
    const changeChain = (chain: ChainType) => {
      dispatch(setChain(chain));
    };

    if (typeof window !== `undefined`) {
      const persistedChainType =
        (localStorage.getItem(`ChainType`) as ChainType) ?? ChainType.TestNet;
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

    const persistedGateway = localStorage.getItem(`IpfsGateway`) as IpfsGateway;

    if (persistedGateway) {
      dispatch(setGateway(persistedGateway));
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
          welcomeMessage={`Welcome to the AlgoRealm v${pJson.version} 👑\nType 'help' to get started.`}
          promptLabel={customPromptLabel}
        />
      </Container>
    </div>
  );
};

export default Console;
