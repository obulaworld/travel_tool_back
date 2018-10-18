import notificationEngine from '../NotificationEngine';

global.io = {
  sockets: {
    emit: jest.fn((event, dataToEmit) => dataToEmit)
  }
};
describe('Notification Engine', () => {
  it('should check for Invalid data', async (done) => {
    notificationEngine.notify({
      senderId: '5e3RF6',
      recipientId: '94u7fnjsajY',
      notificationType: 'pending',
      message: 'Approved',
      notificationLink: '/requests/my-approvals/',
      senderName: 'maxwell smith',
      senderImage: '/path/to/image',
    });
    expect(global.io.sockets.emit.mock.calls.length).toBe(0);
    done();
  });
});
