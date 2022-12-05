import {
  ALGOREALM_APP_ID,
  ALGOREALM_LAW_LSIG,
  ALGOREALM_REWARDS_POOL,
} from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import algosdk from 'algosdk';
import { getAlgoRealmAssetOwner } from '../accounts/getAlgorealmAssetOwner';
import createTransactionToSign from './createTransactionToSign';
import getTransactionParams from './getTransactionParams';

export const getClaimAssetTxns = async (
  chain: ChainType,
  claimerAddress: string,
  assetIndex: number,
  claimArg: string,
  newMajesty: string,
  donationAmount: number,
) => {
  const suggestedParams = await getTransactionParams(chain);

  const claimAssetTxn = createTransactionToSign(
    algosdk.makeApplicationNoOpTxnFromObject({
      from: claimerAddress,
      appIndex: ALGOREALM_APP_ID(chain),
      appArgs: [
        new Uint8Array(Buffer.from(claimArg, `utf-8`)),
        new Uint8Array(Buffer.from(newMajesty, `utf-8`)),
      ],
      suggestedParams,
    }),
    undefined,
    TransactionToSignType.UserTransaction,
  );

  const donationTxn = createTransactionToSign(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: claimerAddress,
      to: ALGOREALM_REWARDS_POOL,
      amount: donationAmount,
      suggestedParams,
    }),
    undefined,
    TransactionToSignType.UserTransaction,
  );

  const owner = await getAlgoRealmAssetOwner(chain, assetIndex);

  const nftTransferTxn = createTransactionToSign(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: ALGOREALM_LAW_LSIG(chain).address(),
      suggestedParams,
      to: claimerAddress,
      amount: 1,
      assetIndex: assetIndex,
      revocationTarget: owner,
    }),
    ALGOREALM_LAW_LSIG(chain),
    TransactionToSignType.LsigTransaction,
  );

  return [claimAssetTxn, donationTxn, nftTransferTxn];
};

// def claim_nft(
//   algod_client: algod.AlgodClient,
//   indexer_client: indexer.IndexerClient,
//   claimer: Account,
//   claim_arg: str,
//   new_majesty: str,
//   donation_amount: int,
//   nft_id: int,
// ):
//   params = algod_client.suggested_params()

//   claim_txn = transaction.ApplicationNoOpTxn(
//       sender=claimer.address,
//       sp=params,
//       index=ALGOREALM_APP_ID,
//       app_args=[claim_arg.encode(), new_majesty.encode()],
//   )

//   donation_txn = transaction.PaymentTxn(
//       sender=claimer.address,
//       sp=params,
//       receiver=REWARDS_POOL,
//       amt=donation_amount,
//   )

//   nft_transfer = transaction.AssetTransferTxn(
//       sender=ALGOREALM_LAW.address,
//       sp=params,
//       receiver=claimer.address,
//       amt=1,
//       index=nft_id,
//       revocation_target=current_owner(indexer_client, nft_id),
//   )

//   signed_group = group_and_sign(
//       [claimer, claimer, ALGOREALM_LAW],
//       [claim_txn, donation_txn, nft_transfer],
//   )

//   nft_name = algod_client.asset_info(nft_id)["params"]["name"]

//   print(
//       f"Claiming the {nft_name} as {new_majesty}, "
//       f"donating {donation_amount / 10 ** 6} ALGO...\n"
//   )
//   try:
//       gtxn_id = algod_client.send_transactions(signed_group)
//       wait_for_confirmation(algod_client, gtxn_id)
//   except AlgodHTTPError:
//       quit(
//           "\n☹️  Were you too stingy? Only generous hearts will rule over "
//           "Algorand Realm!\n️"
//       )
