import notificationEngine from '../NotificationEngine';

global.io = {
  sockets: {
    emit: jest.fn((event, dataToEmit) => dataToEmit)
  }
};
describe('Notification Engine', () => {
  it('should check for Invalid data', async () => {
    notificationEngine.notify('senderMother');
    expect(global.io.sockets.emit.mock.calls.length).toBe(0);
  });
});
