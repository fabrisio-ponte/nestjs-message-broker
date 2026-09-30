import { Module } from '@nestjs/common';
import { WorkModule } from './work.module';

@Module({
  imports: [WorkModule],
})
export class AppModule {}
