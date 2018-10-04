import switchMessage from '../switchMessage';

describe('switchMessage helper', () => {
  it('should return new Request message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'New Request', senderName: 'Tester' }
    );

    expect(receivedMessage.split(' ')).toContain(
      'Login'
    );
    done();
  });
});
