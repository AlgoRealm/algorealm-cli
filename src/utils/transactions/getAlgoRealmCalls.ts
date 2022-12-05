import { ALGOREALM_APP_ID, ALGOREALM_FIRST_BLOCK } from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { indexerForChain } from '../algorand';

export const getAlgoRealmCalls = async (
  chain: ChainType,
  assetIndex?: number,
) => {
  let token = ``;
  let numtxn = 1;
  const calls = [];

  while (numtxn > 0) {
    let query = indexerForChain(chain)
      .searchForTransactions()
      .limit(1000)
      .nextToken(token)
      .minRound(ALGOREALM_FIRST_BLOCK(chain));

    if (assetIndex) {
      query = query.assetID(assetIndex).txType(`axfer`);
    } else {
      query = query.applicationID(ALGOREALM_APP_ID(chain));
    }

    const result = await query.do();

    calls.push(...result.transactions);
    numtxn = result.transactions.length;
    if (numtxn > 0) {
      token = result[`next-token`];
    }
  }

  return calls as Record<string, any>[];
};
