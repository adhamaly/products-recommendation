// firebase.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Module({})
export class FirebaseModule {
  static forRoot(): DynamicModule {
    return {
      module: FirebaseModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'FIREBASE_ADMIN',
          useFactory: (configService: ConfigService) => {
            const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
            const privateKey = configService
              .get<string>('FIREBASE_PRIVATE_KEY')
              .replace(/\\n/g, '\n');
            const clientEmail = configService.get<string>(
              'FIREBASE_CLIENT_EMAIL',
            );

            return admin.initializeApp({
              credential: admin.credential.cert({
                projectId,
                privateKey,
                clientEmail,
              }),
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: ['FIREBASE_ADMIN'],
    };
  }
}
