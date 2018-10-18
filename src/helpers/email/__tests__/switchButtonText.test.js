import switchButtonText from '../switchButtonText';

describe('Switch Button helper', () => {
  it('should show View Request in case of new request ', (done) => {
    expect(switchButtonText('New Request')).toEqual('View Request');
    done();
  });
  it('should return nothing if type is not available', (done) => {
    expect(switchButtonText('')).toEqual('');
    done();
  });
  it('should show View Request in case of new request ', (done) => {
    expect(switchButtonText('Trip Survey')).toEqual('Fill Survey');
    done();
  });
});
