import { about } from './about';

describe(`about`, () => {
  it(`should return the expected string`, () => {
    expect(about()).toEqual(
      `AlgoRealm UI is an open-source terminal emulator web app built by @aorumbayev for the AlgoRealm CLI game created by @cusma. AlgoRealm UI is available under the GPLv3 license. CLI commands are identical to the original commands in the AlgoRealm documentation. However, they simplify the authentication and provide a higher degree of extensibility in the future. For more details, refer to https://github.com/cusma/algorealm - another fun way to play AlgoRealm that allows learning a few lower-level nuances of interacting with the Algorand blockchain.`,
    );
  });
});
