import { Asset } from '@/models/Asset';

export const hasAsset = (assetIndex: number, assets: Asset[]) => {
  return assets.some((asset) => asset.index === assetIndex);
};
