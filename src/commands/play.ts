import { Command, CommandMessage } from 'discord.js-commando';
import { getBasicInfo } from 'ytdl-core-discord';
import { htmlUnescapeTag } from 'escape-goat';
import pino from 'pino';
import { VoiceChannel } from 'discord.js';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';

import MusicBot from '../MusicBot';
import QueueItem from '../queue/QueueItem';
import TrackQueue from '../queue/TrackQueue';

const logger = pino();

const ytOptions: youtubeSearch.YouTubeSearchOptions = {
  maxResults: 1,
  key: process.env.YOUTUBE_API_KEY,
};

export default class PlayCommand extends Command {
  private readonly trackQueue: TrackQueue;

  constructor(client: MusicBot) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Search YouTube and play a track, or resume playback',
      guildOnly: true,
      args: [
        {
          key: 'searchQuery',
          prompt: 'What track would you like to search for?',
          type: 'string',
          default: '',
        },
      ],
    });

    this.trackQueue = client.trackQueue;
  }

  async run(message: CommandMessage, { searchQuery }: { searchQuery: string }) {
    // If no argument given try resume existing track
    if (searchQuery.trim() === '') {
      this.trackQueue.resume();
      return message.say('Resuming...');
    }

    // Make sure author is in a voice channel
    const { voiceChannel } = message.member;
    if (!voiceChannel) {
      return message.say('You must be in a voice channel to use this command');
    }

    // Check if an URL was given
    if (searchQuery.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)) {
      const videoInfo = await getBasicInfo(searchQuery);
      const { title } = videoInfo;
      const reply = this.queueTrack(title, searchQuery, voiceChannel);
      return message.say(reply);
    }

    // Get top result from YouTube data API
    const { results } = await youtubeSearch(searchQuery, ytOptions);
    const result: YouTubeSearchResults = results[0];
    const { link, title } = result;

    const reply = this.queueTrack(title, link, voiceChannel);
    return message.say(reply);
  }

  private queueTrack(title: string, link: string, voiceChannel: VoiceChannel) {
    this.trackQueue.push(new QueueItem(title, link, voiceChannel))

    const reply = htmlUnescapeTag`Playing ${title}`;
    logger.debug(reply);
    return reply;
  }
}
