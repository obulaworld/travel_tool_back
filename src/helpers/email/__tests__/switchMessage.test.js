import switchMessage from '../switchMessage';

describe('switchMessage helper', () => {
  it('should return new Request message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'New Request', senderName: 'Tester' }
    );

    expect(receivedMessage.split(' ')).toContain('Login');
    done();
  });

  it('should return approved message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Approved', senderName: 'An_Jin', requestId: '36Ydgha42e' }
    );

    expect(receivedMessage.split(' ')).toContain('An_Jin.');
    expect(receivedMessage.split(' ')[3]).toEqual('<b>#36Ydgha42e</b>');
    done();
  });

  it('should return reject message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Rejected', senderName: 'Mixon_yong', requestId: '36Ydgha42e' }
    );

    expect(receivedMessage.split(' ')).toContain('Mixon_yong.');
    expect(receivedMessage.split(' ')[3]).toEqual('<b>#36Ydgha42e</b>');
    done();
  });

  it('should return posted comment message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Comments', senderName: 'Tester' }
    );
    expect(receivedMessage.split(' ')).toContain('<b>Tester</b>');
    expect(receivedMessage.split(' ')[6]).toEqual('<b>Tester</b>');
    done();
  });
  it('should return nothing for non-available type', (done) => {
    const receivedMessage = switchMessage(
      { type: 'notification', senderName: 'Tester' }
    );
    expect(receivedMessage).toEqual('');
    done();
  });
});
