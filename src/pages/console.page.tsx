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
import { useEffect, useMemo, useState } from 'react';
import Terminal from 'react-console-emulator';
import { PeraWalletConnect } from '@perawallet/connect';
import { ellipseAddress } from '@/utils/ellipseAddress';
import { useSnackbar } from 'notistack';
import { indexerForChain } from '@/utils/algorand';
import { ChainType } from '@/models/Chain';
import { getAlgoRealmHistory } from '@/utils/getAlgoRealmHistory';
import { getAlgoRealmCalls } from '@/utils/getAlgoRealmCalls';
import { ALGOREALM_CROWN_ID, ALGOREALM_POEM } from '@/common/constants';
import { optInAsset } from '@/utils/optInAsset';

const peraWallet = new PeraWalletConnect();

const Console = () => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const isConnectedToPeraWallet = useMemo(() => {
    return !!accountAddress;
  }, [accountAddress]);

  const { enqueueSnackbar } = useSnackbar();

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

  const handleDisconnectWalletClick = () => {
    peraWallet.disconnect().catch((error) => {
      console.log(error);
    });
    enqueueSnackbar(
      `Disconnected from PeraWallet: ${ellipseAddress(accountAddress, 4)}`,
      {
        variant: `success`,
      },
    );
    setAccountAddress(null);
  };

  const handleConnectWalletClick = () => {
    peraWallet
      .connect()
      .then((newAccounts) => {
        if (peraWallet.connector) {
          peraWallet.connector.on(`disconnect`, handleDisconnectWalletClick);
        }

        setAccountAddress(newAccounts[0]);
        enqueueSnackbar(
          `Connected to PeraWallet: ${ellipseAddress(newAccounts[0], 4)}`,
          {
            variant: `success`,
          },
        );
      })
      .catch((error) => {
        if (error?.data?.type !== `CONNECT_MODAL_CLOSED`) {
          console.log(error);
        }
      });
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
      fn: () => {
        return ALGOREALM_POEM;
      },
    },
    'claim-crown': {
      description: `Claim the Crown of Entropy, become the Randomic Majesty of Algorand.`,
      usage: `claim-crown <majesty-name> <algos>`,
      fn: async (...args) => {
        const test = args.join(` `);

        if (!isConnectedToPeraWallet || !accountAddress) {
          return `You must connect to PeraWallet to claim the Crown of Entropy.`;
        }

        return optInAsset(accountAddress, ALGOREALM_CROWN_ID, peraWallet);
      },
    },
    login: {
      description: `Login to PeraWallet | Print login status`,
      fn: () => {
        if (isConnectedToPeraWallet) {
          return `You are already connected to PeraWallet: ${ellipseAddress(
            accountAddress,
            4,
          )}`;
        }
        handleConnectWalletClick();
      },
    },
    logout: {
      description: `Logout from PeraWallet`,
      fn: () => {
        if (!isConnectedToPeraWallet) {
          return `You are already logged out: ${ellipseAddress(
            accountAddress,
            4,
          )}`;
        }
        handleDisconnectWalletClick();
      },
    },
  };

  const customPromptLabel = useMemo(() => {
    return isConnectedToPeraWallet
      ? `(${ellipseAddress(accountAddress, 4)})$➜`
      : `➜`;
  }, [accountAddress, isConnectedToPeraWallet]);

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (peraWallet.connector) {
          peraWallet.connector.on(`disconnect`, handleDisconnectWalletClick);
        }

        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  });

  return (
    <div>
      <PageHeader
        title="🏰 AlgoRealm 👑"
        description="Claim the Crown and the Sceptre of Algorand Realm (cli emulator edition)"
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
