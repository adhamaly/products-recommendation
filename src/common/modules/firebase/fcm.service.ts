import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FCMService {
  protected fcmApp: admin.messaging.Messaging;

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {
    if (!firebaseApp) {
      throw new Error('Firebase app has failed to initialize');
    }

    this.fcmApp = this.firebaseApp.messaging();
  }

  async sendToSingleToken(
    title: string,
    body: string,
    token: string,
    dryRun: boolean = true,
  ) {
    try {
      const response = await this.fcmApp.send(
        {
          token,
          data: {
            title,
            body,
          },
        },
        dryRun,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendToTopicSubscribed(
    title: string,
    body: string,
    topic: string,
    dryRun: boolean = true,
  ) {
    try {
      const response = await this.fcmApp.send(
        {
          topic,
          data: {
            title,
            body,
          },
        },
        dryRun,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async subscribeToTopic(
    tokenOrTokens: string | string[],
    topic: string,
  ): Promise<void> {
    await this.fcmApp.subscribeToTopic(tokenOrTokens, topic);
  }

  async unsubscribeFromTopic(
    tokenOrTokens: string | string[],
    topic: string,
  ): Promise<void> {
    await this.fcmApp.unsubscribeFromTopic(tokenOrTokens, topic);
  }
}
