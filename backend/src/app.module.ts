import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { MajorsModule } from './majors/majors.module';
import { BatchesModule } from './batches/batches.module';
import { ClassesModule } from './classes/classes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { EmployeesModule } from './employees/employees.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AttendancesModule } from './attendances/attendances.module';
import { TeachingLogsModule } from './teaching-logs/teaching-logs.module';
import { AcademicCalendarModule } from './academic-calendar/academic-calendar.module';
import { ExamsModule } from './exams/exams.module';
import { ExamSessionsModule } from './exam-sessions/exam-sessions.module';
import { GradesModule } from './grades/grades.module';
import { StatsModule } from './stats/stats.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { FinanceModule } from './finance/finance.module';
import { AssetsModule } from './assets/assets.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { BranchesModule } from './branches/branches.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    MajorsModule,
    BatchesModule,
    ClassesModule,
    RolesModule,
    PermissionsModule,
    EmployeesModule,
    SubjectsModule,
    SchedulesModule,
    AttendancesModule,
    TeachingLogsModule,
    AcademicCalendarModule,
    ExamsModule,
    ExamSessionsModule,
    GradesModule,
    StatsModule,
    ApplicantsModule,
    FinanceModule,
    AssetsModule,
    AuditLogsModule,
    BranchesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
