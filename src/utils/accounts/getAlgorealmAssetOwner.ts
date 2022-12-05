import { ChainType } from '@/models/Chain';
import { getAlgoRealmCalls } from '../transactions/getAlgoRealmCalls';

export const getAlgoRealmAssetOwner = async (
  chain: ChainType,
  assetIndex: number | undefined,
) => {
  const calls = await getAlgoRealmCalls(chain, assetIndex);

  calls.reverse();

  for (const txn of calls) {
    if (txn[`asset-transfer-transaction`][`amount`] == 1) {
      return txn[`asset-transfer-transaction`][`receiver`];
    }
  }
};
