import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/common/modules/firebase/firebase.module';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FCMService } from 'src/common/modules/firebase/fcm.service';

@Module({
  imports: [FirebaseModule.forRoot()],
  controllers: [],
  providers: [NotificationService, PrismaService, FCMService],
  exports: [],
})
export class NotificationModule {}
