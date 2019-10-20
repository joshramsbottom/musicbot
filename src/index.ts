import * as path from 'path';

import MusicBot from './MusicBot';
import './util/secrets';

const client = new MusicBot();

client.registry
  .registerDefaultTypes()
  .registerGroup(['music', 'Music commands'])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
  client.user.setActivity('!help');
});

client.on('error', console.error);

client.login(process.env.DISCORD_TOKEN);
