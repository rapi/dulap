import { Module } from '@nestjs/common';
import { BehanceController } from './behance.controller';
import { BehanceService } from './behance.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [BehanceController],
  providers: [BehanceService],
  imports: [CacheModule.register()],
})
export class BehanceModule {}
