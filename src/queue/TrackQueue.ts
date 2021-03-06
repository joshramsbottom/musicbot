import pino from 'pino';
import { StreamDispatcher, VoiceConnection } from "discord.js";
import ytdl from "ytdl-core";

import QueueItem from "./QueueItem";

const logger = pino({ level: 'debug' });

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
      logger.error('Connection error:', error);
    });

    // Play track
    const stream = ytdl(link, {
      filter: 'audioonly',
    });

    stream.on('error', error => {
      logger.error('Stream error:', error);
      this.onTrackFinished(connection);
    });

    this.dispatcher = connection.play(stream);

    // Set up handler when track ends
    this.dispatcher.on('finish', () => {
      logger.info('Song ended');
      this.onTrackFinished(connection);
    });

    this.dispatcher.on('error', error => {
      logger.error('Dispatcher error:', error);
      this.onTrackFinished(connection);
    });
    this.dispatcher.on('debug', info => {
      logger.debug(info);
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
        logger.info('Disconnecting because there are no songs queued');
        connection.disconnect();
      }
    }, 60000);
  }

  private isEmpty() {
    return this.queue.length === 0;
  }
}
