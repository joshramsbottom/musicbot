import { Command, CommandoMessage } from 'discord.js-commando';

import MusicBot from '../MusicBot';
import TrackQueue from '../queue/TrackQueue';

export default class PauseCommand extends Command {
  private readonly trackQueue: TrackQueue;

  constructor(client: MusicBot) {
    super(client, {
      name: 'pause',
      aliases: ['stop'],
      group: 'music',
      memberName: 'pause',
      description: 'Pause playback',
      guildOnly: true,
    });

    this.trackQueue = client.trackQueue;
  }

  run(message: CommandoMessage) {
    this.trackQueue.pause();
    return message.say('Pausing...');
  }
}
