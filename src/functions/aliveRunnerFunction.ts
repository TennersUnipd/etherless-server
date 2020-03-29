const aliveRunner = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Runner running'),
  };
  return response;
};

export default aliveRunner;
