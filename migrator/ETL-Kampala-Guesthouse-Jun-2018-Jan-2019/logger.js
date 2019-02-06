/* globals migrationLogger */
process.env.DEBUG = 'Migrations*, =,';

const debug = require('debug');

debug.log = console.log.bind(console);

global.migrationLogger = debug('Migrations');
global.delimiterLogger = () => debug('=')('='.repeat(150));

module.exports = {
  dbLogger: migrationLogger.extend('Database'),
  axiosLogger: migrationLogger.extend('Axios'),
  failedLogger: migrationLogger.extend('Failed'),
  extractLogger: migrationLogger.extend('Extraction'),
};
