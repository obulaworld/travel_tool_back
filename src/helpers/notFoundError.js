const notFoundError = (error, response) => (
  response.status(404).json({
    success: false,
    error,
  })
);

export default notFoundError;
