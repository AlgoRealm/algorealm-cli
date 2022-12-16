import { changeChain } from './changeChain';
import { ChainType } from '@/models/Chain';
import store from '@/redux/store';
import { setChain } from '@/redux/slices/walletConnectSlice';

describe(`changeChain`, () => {
  it(`should dispatch the setChain action with the correct chain type`, () => {
    const spy = jest.spyOn(store, `dispatch`);
    const chain = ChainType.MainNet;
    changeChain(chain);
    expect(spy).toHaveBeenCalledWith(setChain(chain));
  });

  it(`should return the expected string`, () => {
    const chain = ChainType.MainNet;
    expect(changeChain(chain)).toEqual(`Chain changed to ${chain}`);
  });

  it(`should throw an error if the store dispatch method throws an error`, () => {
    const spy = jest.spyOn(store, `dispatch`).mockImplementation(() => {
      throw new Error(`dispatch error`);
    });
    const chain = ChainType.MainNet;
    expect(() => changeChain(chain)).toThrowError(`dispatch error`);
  });
});
