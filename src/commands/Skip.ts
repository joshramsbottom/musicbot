import { Command, CommandMessage } from 'discord.js-commando';

import MusicBot from '../MusicBot';
import TrackQueue from '../queue/TrackQueue';

export default class SkipCommand extends Command {
  private readonly trackQueue: TrackQueue;

  constructor(client: MusicBot) {
    super(client, {
      name: 'skip',
      aliases: ['next'],
      group: 'music',
      memberName: 'skip',
      description: 'Skip the currently playing track',
      guildOnly: true,
    });

    this.trackQueue = client.trackQueue;
  }

  async run(message: CommandMessage) {
    await this.trackQueue.playNext();
    return message.say('Skipped');
  }
}
