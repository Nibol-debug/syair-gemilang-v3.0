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
exports.GradeAnalysisController = void 0;
const common_1 = require("@nestjs/common");
const grade_analysis_service_1 = require("./grade-analysis.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let GradeAnalysisController = class GradeAnalysisController {
    gradeAnalysisService;
    constructor(gradeAnalysisService) {
        this.gradeAnalysisService = gradeAnalysisService;
    }
    getExamStatistics(examId) {
        return this.gradeAnalysisService.getExamStatistics(examId);
    }
    getQuestionsForReview(examId) {
        return this.gradeAnalysisService.getQuestionsForReview(examId);
    }
    getClassSubjectAnalysis(classId, subjectId, batchId) {
        return this.gradeAnalysisService.getClassSubjectAnalysis(classId, subjectId, batchId);
    }
};
exports.GradeAnalysisController = GradeAnalysisController;
__decorate([
    (0, common_1.Get)('exam/:examId/statistics'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GradeAnalysisController.prototype, "getExamStatistics", null);
__decorate([
    (0, common_1.Get)('exam/:examId/review'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GradeAnalysisController.prototype, "getQuestionsForReview", null);
__decorate([
    (0, common_1.Get)('class/:classId/subject/:subjectId'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('subjectId')),
    __param(2, (0, common_1.Query)('batch_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GradeAnalysisController.prototype, "getClassSubjectAnalysis", null);
exports.GradeAnalysisController = GradeAnalysisController = __decorate([
    (0, common_1.Controller)('grade-analysis'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [grade_analysis_service_1.GradeAnalysisService])
], GradeAnalysisController);
//# sourceMappingURL=grade-analysis.controller.js.map