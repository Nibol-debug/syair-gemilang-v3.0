"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const students_module_1 = require("./students/students.module");
const majors_module_1 = require("./majors/majors.module");
const batches_module_1 = require("./batches/batches.module");
const classes_module_1 = require("./classes/classes.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const audit_interceptor_1 = require("./common/interceptors/audit.interceptor");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const employees_module_1 = require("./employees/employees.module");
const subjects_module_1 = require("./subjects/subjects.module");
const schedules_module_1 = require("./schedules/schedules.module");
const attendances_module_1 = require("./attendances/attendances.module");
const teaching_logs_module_1 = require("./teaching-logs/teaching-logs.module");
const academic_calendar_module_1 = require("./academic-calendar/academic-calendar.module");
const exams_module_1 = require("./exams/exams.module");
const exam_sessions_module_1 = require("./exam-sessions/exam-sessions.module");
const grades_module_1 = require("./grades/grades.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            majors_module_1.MajorsModule,
            batches_module_1.BatchesModule,
            classes_module_1.ClassesModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            employees_module_1.EmployeesModule,
            subjects_module_1.SubjectsModule,
            schedules_module_1.SchedulesModule,
            attendances_module_1.AttendancesModule,
            teaching_logs_module_1.TeachingLogsModule,
            academic_calendar_module_1.AcademicCalendarModule,
            exams_module_1.ExamsModule,
            exam_sessions_module_1.ExamSessionsModule,
            grades_module_1.GradesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map