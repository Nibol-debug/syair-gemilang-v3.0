import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExamSessionsService } from './exam-sessions.service';
import { StartExamDto, SubmitAnswerDto, LogViolationDto } from './dto/exam-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamSessionsController {
  constructor(private readonly examSessionsService: ExamSessionsService) {}

  @Post(':id/start')
  startExam(@Param('id') id: string, @Body() data: StartExamDto, @Request() req) {
    return this.examSessionsService.startExam(req.user.studentId, id, data);
  }

  @Post('sessions/:sessionId/answers')
  submitAnswer(@Param('sessionId') sessionId: string, @Body() data: SubmitAnswerDto) {
    return this.examSessionsService.submitAnswer(sessionId, data);
  }

  @Post('sessions/:sessionId/log')
  logViolation(@Param('sessionId') sessionId: string, @Body() data: LogViolationDto) {
    return this.examSessionsService.logViolation(sessionId, data);
  }

  @Post('sessions/:sessionId/submit')
  submitExam(@Param('sessionId') sessionId: string) {
    return this.examSessionsService.finalizeExam(sessionId);
  }
}
