import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BehanceModule } from './behance/behance.module';

@Module({
  imports: [BehanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
