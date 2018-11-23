import switchButtonText from '../switchButtonText';

describe('Switch Button helper', () => {
  it('should show View Request in case of new request', (done) => {
    expect(switchButtonText('New Request')).toEqual('View Request');
    done();
  });
  it('should return nothing if type is not available', (done) => {
    expect(switchButtonText('')).toEqual('View Request');
    done();
  });
  it('should show Fill Survey in case of Trip Survey', (done) => {
    expect(switchButtonText('Trip Survey')).toEqual('Fill Survey');
    done();
  });
  it('should show View Dashboard in case of Travel Readiness', (done) => {
    expect(switchButtonText('Travel Readiness')).toEqual('View Dashboard');
    done();
  });
  it('should show View Notification in case of Deleted Request', (done) => {
    expect(switchButtonText('Deleted Request')).toEqual('View Notification');
    done();
  });
});
