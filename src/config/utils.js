// a function to notify when some envrironment variables are unset
const optionalEnvVariables = [
  'DATABASE_DIALECT',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_PASSWORD',
];

module.exports = (env) => {
  const undefinedVariables = Object.keys(env)
    .filter(variable => env[variable] === undefined
                        && !optionalEnvVariables.includes(variable));

  if (!undefinedVariables.length) return env;
  throw new Error(`
    \nThe following variables are required and missing in .env:
    \n${undefinedVariables.join('\n')}`);
};
