import { ChainType } from '@/models/Chain';
import { getAlgoRealmCalls } from '@/utils/transactions/getAlgoRealmCalls';
import { getAlgoRealmHistory } from '@/utils/transactions/getAlgoRealmHistory';

export const printDynasty = async (chain: ChainType) => {
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
