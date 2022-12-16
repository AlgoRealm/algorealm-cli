import { ALGOREALM_CROWN_ID } from '@/common/constants';
import { optAssets } from '@/redux/slices/walletConnectSlice';
import { hasAsset } from '@/utils/assets/hasAsset';
import { getClaimAssetTxns } from '@/utils/transactions/getClaimAssetTxns';
import submitTransactions from '@/utils/transactions/submitTransactions';
import WalletManager from '@/wallets/walletManager';
import store from '@/redux/store';
import { IpfsGateway } from '@/models/Gateway';
import { ChainType } from '@/models/Chain';
import { Asset } from '@/models/Asset';

export const claimCrown = async (
  majestyName: string,
  algos: number,
  chain: ChainType,
  address: string,
  assets: Asset[],
  gateway: IpfsGateway,
  connector: WalletManager,
) => {
  if (!connector.connected) {
    return `You must connect to PeraWallet to claim the Crown of Entropy.`;
  }

  if (!hasAsset(ALGOREALM_CROWN_ID(chain), assets)) {
    await store.dispatch(
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
};
