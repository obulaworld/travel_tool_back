import handleServerError from '../serverError';

describe('serverError: unit test', () => {
  let json, status, response, error; // eslint-disable-line

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn(() => ({ json }));
    response = { status };
    error = 'Error';
  });

  it('returns correct error message', () => {
    expect.assertions(2);
    handleServerError(error, response);
    expect(json).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenCalledWith({ success: false, error });
  });

  it('returns the correct status code', () => {
    expect.assertions(2);
    handleServerError(error, response);
    expect(status).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(500);
  });
});
