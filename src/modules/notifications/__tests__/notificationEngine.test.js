import mail from 'mailgun-js';
import NotificationEngine from '../NotificationEngine';


jest.mock('mailgun-js', () => ({
  messages: jest.fn()
}));

mail.messages.mockImplementation(() => ({
  send: jest.fn()
}));

global.io = {
  sockets: {
    emit: jest.fn((event, dataToEmit) => dataToEmit)
  }
};
describe('Notification Engine', () => {
  it('should check for Invalid data', async (done) => {
    NotificationEngine.notify({
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

  it('should not run mail-gun send function on test mode', async (done) => {
    const mailFunctionRun = NotificationEngine.dispatchEmail({
      senderId: '5e3RF6',
      recipientId: '94u7fnjsajY',
      notificationType: 'pending',
      message: 'Approved',
      notificationLink: '/requests/my-approvals/',
      senderName: 'maxwell smith',
      senderImage: '/path/to/image',
    });
    expect(mailFunctionRun).toBe(false);
    done();
  });

  it('should prepare email and receipinetVars from for bulk email dispatch', async (done) => {
    const users = [
      {
        email: 'victor@andela.com',
        fullName: 'Victor Ugwueze',
      },
      {
        email: 'emake@andela.com',
        fullName: 'Emeka Ugwueze',
      }
    ];
    const { emails, recipientVars } = NotificationEngine.prepareMultipleReceipients(users);
    expect(emails.length).toBe(2);
    expect(Object.keys(recipientVars).includes('victor@andela.com')).toBe(true);
    done();
  });
});
