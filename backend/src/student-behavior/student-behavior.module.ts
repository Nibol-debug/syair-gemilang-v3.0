import { Module } from '@nestjs/common';
import { StudentBehaviorController } from './student-behavior.controller';
import { StudentBehaviorService } from './student-behavior.service';

@Module({
  controllers: [StudentBehaviorController],
  providers: [StudentBehaviorService]
})
export class StudentBehaviorModule {}
