import { StreamDispatcher } from "discord.js";
import ytdl from "ytdl-core-discord";

import QueueItem from "./QueueItem";

export default class TrackQueue {
  private queue: QueueItem[] = [];
  private currentTrack: QueueItem | null = null;
  private dispatcher: StreamDispatcher | null = null;

  public push(item: QueueItem) {
    this.queue.push(item);

    if (this.isStartable()) this.playNext();
  }

  public pause() {
    if (!this.dispatcher) return;

    this.dispatcher.pause();
  }

  public resume() {
    if (!(this.dispatcher && this.currentTrack)) return;

    this.dispatcher.resume();
  }

  public skip() {
    if (!this.dispatcher) return;

    this.dispatcher.end();
  }

  public printQueue() {
    let queueString = '';

    if (this.currentTrack) {
      queueString += `Current track: ${this.currentTrack.title}`;
    }

    if (!this.isEmpty()) {
      this.queue.forEach((item, index) => {
        queueString += `\n${index}. ${item.title}`;
      });
    }

    if (queueString.length === 0) {
      return 'No tracks in queue';
    }

    return queueString;
  }

  private isStartable() {
    return this.currentTrack === null;
  }

  private async playNext() {
    this.currentTrack = this.queue.shift()!;

    // Check if we've hit the end of the queue
    if (!this.currentTrack) {
      return;
    }

    const { channel, link } = this.currentTrack;

    // Join channel
    const connection = await channel.join();
    // Play track
    this.dispatcher = connection.playOpusStream(await ytdl(link, {
      highWaterMark: 1<<25,
    }));
    // Set up handler when track ends
    this.dispatcher.on('end', () => this.onTrackFinished());
  }

  private onTrackFinished() {
    this.dispatcher = null;

    if (!this.isEmpty()) {
      this.playNext();
    }
  }

  private isEmpty() {
    return this.queue.length === 0;
  }
}
