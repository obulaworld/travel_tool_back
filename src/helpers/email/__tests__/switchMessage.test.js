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

  it('should return verified message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Verified', senderName: 'Luke Skywalker', requestId: '36Ydgha42e' }
    );

    expect(receivedMessage.split(' ')).toContain('Luke');
    expect(receivedMessage.split(' ')[3]).toEqual('<b>#36Ydgha42e</b>');
    done();
  });

  it('should return posted comment message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Request', senderName: 'Tester', comment: { dataValues: { picture: 'fake' } } }
    );
    expect(receivedMessage.split(' ')).toContain('Login');
    done();
  });

  it('should return posted comment message on a documemt', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Document', senderName: 'Tester', comment: { dataValues: { picture: 'fake' } } }
    );
    expect(receivedMessage.split(' ')).toContain('Login');
    done();
  });

  it('should return nothing for non-available type', (done) => {
    const receivedMessage = switchMessage(
      { type: 'notification', senderName: 'Tester' }
    );
    expect(receivedMessage).toEqual('');
    done();
  });

  it('should return update Request message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Updated Request', senderName: 'Malibua' }
    );

    expect(receivedMessage.split(' ')).toContain('Login');
    done();
  });

  it('should return delete Request message', (done) => {
    const receivedMessage = switchMessage(
      { type: 'Deleted Request', senderName: 'Malibua' }
    );

    expect(receivedMessage.split(' ')).toContain('Login');
    done();
  });

  it('should return empty string with invalid type', (done) => {
    const receivedMessage = switchMessage(
      { type: 'deleted Request', senderName: 'Malibua' }
    );

    expect(receivedMessage.split(' ')).toContain('');
    done();
  });

  it('should return changed room message', (done) => {
    const receivedMessage = switchMessage({
      type: 'Changed Room', senderName: 'Tester', requestId: '36Ydgha42e'
    });
    expect(receivedMessage.split(' ')).toContain('updated', 'Login');
    done();
  });
  it('should return fill survey message', (done) => {
    const surveyMessage = switchMessage({
      type: 'Trip Survey', senderName: 'Tester'
    });
    expect(surveyMessage.split(' ')).toContain('fill', 'survey');
    done();
  });
  it('should return travel readiness', (done) => {
    const readinessMessage = switchMessage({
      type: 'Travel Readiness', senderName: 'Travela'
    });
    expect(readinessMessage.split(' ')).toContain('achieved', 'readiness');
    done();
  });
  it('should return edit document message', (done) => {
    const editNoticeMessage = switchMessage({
      type: 'Edit Travel Document', details: { user: { name: 'Tester' } }
    });
    expect(editNoticeMessage.split(' ')).toContain('edited', 'document');
    done();
  });
});
