import { IpfsGateway } from '@/models/Gateway';
import { setGateway } from '@/redux/slices/walletConnectSlice';
import store from '@/redux/store';

export const changeGateway = (gateway: string) => {
  store.dispatch(
    setGateway(IpfsGateway[gateway.toUpperCase() as keyof typeof IpfsGateway]),
  );
  return `Gateway changed to ${gateway}`;
};
