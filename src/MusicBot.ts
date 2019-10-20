import { CommandoClient } from "discord.js-commando";

import TrackQueue from "./queue/TrackQueue";

export default class MusicBot extends CommandoClient {
  public readonly trackQueue: TrackQueue;

  constructor() {
    super({
      commandPrefix: '!',
      owner: process.env.OWNER_ID,
    });

    this.trackQueue = new TrackQueue();
  }
}
