// a function to notify when some envrironment variables are unset
import debug from 'debug';

const logger = debug('log');

export default (env) => {
  const undefinedVariables = Object.keys(env)
    .filter(variable => env[variable] === undefined);

  if (!undefinedVariables.length) return env;
  logger(`${undefinedVariables.join(', ')} not found in ENVIRONMENT VARIABLES`);
  return process.exit(1);
};
