const handleServerError = (error, response) => (
  response.status(500).json({
    success: false,
    error,
  })
);

export default handleServerError;
