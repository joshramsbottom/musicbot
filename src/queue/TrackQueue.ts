import { StreamDispatcher, VoiceConnection } from "discord.js";
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
        queueString += `\n${index + 1}. ${item.title}`;
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

    connection.on('error', error => {
      console.error('Connection error: ', error);
    });

    // Play track
    this.dispatcher = connection.playOpusStream(await ytdl(link, {
      highWaterMark: 1<<25,
    }));

    // Set up handler when track ends
    this.dispatcher.on('end', reason => {
      console.log(`Song ended (${reason})`);
      this.onTrackFinished(connection);
    });

    this.dispatcher.on('error', error => {
      console.error('Dispatcher error: ', error);
    });
    this.dispatcher.on('debug', info => {
      console.log('DEBUG ', info);
    });
  }

  private onTrackFinished(connection: VoiceConnection) {
    // Remove event listeners
    if (this.dispatcher) {
      this.dispatcher.removeAllListeners();
    }

    this.dispatcher = null;
    this.currentTrack = null;

    if (!this.isEmpty()) {
      this.playNext();
      return;
    }

    // Start a timer to disconnect if no more tracks are queued
    setTimeout(() => {
      if (this.isEmpty()) {
        console.log('Disconnecting because there are no songs queued');
        connection.disconnect();
      }
    }, 60000);
  }

  private isEmpty() {
    return this.queue.length === 0;
  }
}
