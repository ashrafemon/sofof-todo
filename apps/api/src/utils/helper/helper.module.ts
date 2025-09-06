import { Global, Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
