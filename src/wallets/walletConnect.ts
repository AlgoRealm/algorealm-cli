import { AlgoRealmWallet, WalletType } from '@/models/Wallet';
import { encodeAddress, Transaction, decodeSignedTransaction } from 'algosdk';
import store from '@/redux/store';
import { onSessionUpdate } from '@/redux/slices/walletConnectSlice';
import { CONNECTED_WALLET_TYPE } from '@/common/constants';
import { PeraWalletConnect } from '@perawallet/connect';

export class WalletConnectSingleton {
  private static _instance: PeraWalletConnect;

  private constructor() {
    //...
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new PeraWalletConnect());
  }
}

export default class WalletConnectClient implements AlgoRealmWallet {
  private client: PeraWalletConnect;

  constructor(client: PeraWalletConnect) {
    this.client = client;
  }

  public connect = async () => {
    if (this.client.isConnected) return;
    let accounts = [];

    try {
      accounts = await this.client.connect();
    } catch (e) {
      console.warn(e);
      accounts = await this.client.reconnectSession();
    }

    if (this.client.connector) {
      this.client.connector.on(`disconnect`, this.disconnect);
    }

    localStorage.setItem(CONNECTED_WALLET_TYPE, WalletType.PeraWallet);
    store.dispatch(onSessionUpdate(accounts));
  };

  public address = () => {
    return ``;
  };

  public accounts = () => {
    return this.client.connector?.accounts || [];
  };

  public signTransactions = async (txnGroup: Transaction[]) => {
    if (!this.client.isConnected) {
      throw new Error(`Client not connected`);
    }

    const txns = txnGroup.map((txn) => {
      if (
        this.client.connector?.accounts[0] === encodeAddress(txn.from.publicKey)
      ) {
        return [{ txn: txn, signers: [this.client.connector?.accounts[0]] }];
      } else {
        return [{ txn: txn, signers: [] }];
      }
    });

    const response = await this.client.signTransaction(txns);

    return txnGroup.map((txn) => {
      for (const signedTxn of response) {
        const decodedTxn = decodeSignedTransaction(signedTxn);
        console.log(decodedTxn.txn.txID().toString());
        if (decodedTxn.txn.txID() === txn.txID().toString()) {
          return signedTxn;
        }
      }
      return null;
    });
  };

  public disconnect = async () => {
    if (this.client && this.client.isConnected) {
      localStorage.removeItem(CONNECTED_WALLET_TYPE);
      await this.client.disconnect();
    } else {
      return Promise.resolve();
    }
  };

  public connected = () => {
    return this.client.isConnected;
  };
}
