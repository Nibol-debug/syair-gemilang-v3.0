"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSessionsController = void 0;
const common_1 = require("@nestjs/common");
const exam_sessions_service_1 = require("./exam-sessions.service");
const exam_session_dto_1 = require("./dto/exam-session.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let ExamSessionsController = class ExamSessionsController {
    examSessionsService;
    constructor(examSessionsService) {
        this.examSessionsService = examSessionsService;
    }
    startExam(id, data, req) {
        return this.examSessionsService.startExam({ studentId: req.user.studentId, examId: id }, data);
    }
    startExamApplicant(id, data) {
        return this.examSessionsService.startExam({ applicantId: data.applicantId, examId: id }, data);
    }
    getSessionDetail(sessionId) {
        return this.examSessionsService.getSessionDetail(sessionId);
    }
    submitAnswer(sessionId, data) {
        return this.examSessionsService.submitAnswer(sessionId, data);
    }
    logViolation(sessionId, data) {
        return this.examSessionsService.logViolation(sessionId, data);
    }
    submitExam(sessionId) {
        return this.examSessionsService.finalizeExam(sessionId);
    }
    forceSubmitExam(sessionId) {
        return this.examSessionsService.forceSubmit(sessionId);
    }
};
exports.ExamSessionsController = ExamSessionsController;
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exam_session_dto_1.StartExamDto, Object]),
    __metadata("design:returntype", void 0)
], ExamSessionsController.prototype, "startExam", null);
__decorate([
    (0, common_1.Post)(':id/start-applicant'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExamSessionsController.prototype, "startExamApplicant", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamSessionsController.prototype, "getSessionDetail", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/answers'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exam_session_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", void 0)
], ExamSessionsController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/log'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exam_session_dto_1.LogViolationDto]),
    __metadata("design:returntype", void 0)
], ExamSessionsController.prototype, "logViolation", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/submit'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamSessionsController.prototype, "submitExam", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/force-submit'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamSessionsController.prototype, "forceSubmitExam", null);
exports.ExamSessionsController = ExamSessionsController = __decorate([
    (0, common_1.Controller)('exams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [exam_sessions_service_1.ExamSessionsService])
], ExamSessionsController);
//# sourceMappingURL=exam-sessions.controller.js.map