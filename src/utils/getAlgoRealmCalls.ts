import { ALGOREALM_APP_ID, ALGOREALM_FIRST_BLOCK } from '@/common/constants';
import { ChainType } from '@/models/Chain';
import { indexerForChain } from './algorand';

export const getAlgoRealmCalls = async () => {
  let token = ``;
  let numtxn = 1;
  const calls = [];

  while (numtxn > 0) {
    const result = await indexerForChain(ChainType.MainNet)
      .searchForTransactions()
      .limit(1000)
      .nextToken(token)
      .applicationID(ALGOREALM_APP_ID)
      .minRound(ALGOREALM_FIRST_BLOCK)
      .do();
    calls.push(...result.transactions);
    numtxn = result.transactions.length;
    if (numtxn > 0) {
      token = result[`next-token`];
    }
  }

  return calls;
};
