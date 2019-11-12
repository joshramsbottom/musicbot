import * as path from 'path';
import pino from 'pino';

import MusicBot from './MusicBot';
import './util/secrets';

const logger = pino({ level: 'debug' });
const client = new MusicBot();

client.registry
  .registerDefaultTypes()
  .registerGroup(['music', 'Music commands'])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag} (${client.user.id})`);
  client.user.setActivity('!help');
});
client.on('debug', message => logger.debug(message));
client.on('warn', message => logger.warn(message));
client.on('error', message => logger.error(message));

process.on('uncaughtException', pino.final(logger, (error, finalLogger) => {
  finalLogger.error(error, 'uncaughtException');
  process.exit(1);
}));

client.login(process.env.DISCORD_TOKEN);
