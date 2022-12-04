import { ChainType } from '@/models/Chain';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';
import getTransactionParams from './transactions/getTransactionParams';
import submitTransactions from '@/utils/transactions/submitTransactions';

export const optInAsset = async (
  userAddress: string,
  assetIndex: number,
  peraWallet: PeraWalletConnect,
) => {
  const suggestedParams = await getTransactionParams(ChainType.MainNet);
  const axferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: userAddress,
    to: userAddress,
    amount: 0,
    assetIndex: assetIndex,
    note: new Uint8Array(
      Buffer.from(
        `I am an asset opt-in transaction for AlgoRealm asset ${assetIndex}, thank you for playing AlgoRealm!`,
      ),
    ),
    closeRemainderTo: undefined,
    suggestedParams,
  });
  const axferSignerTxn = [{ txn: axferTxn, signers: [userAddress] }];

  const signedTxn = await peraWallet.signTransaction(
    [axferSignerTxn],
    userAddress,
  );

  return submitTransactions(ChainType.MainNet, signedTxn);
};
