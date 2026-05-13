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
exports.ReportCardsController = void 0;
const common_1 = require("@nestjs/common");
const report_cards_service_1 = require("./report-cards.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let ReportCardsController = class ReportCardsController {
    reportCardsService;
    constructor(reportCardsService) {
        this.reportCardsService = reportCardsService;
    }
    getReportCardData(studentId, semester) {
        return this.reportCardsService.getReportCardData(studentId, parseInt(semester.toString()));
    }
    async downloadReportCard(studentId, semester) {
        return this.reportCardsService.generateReportCard(studentId, parseInt(semester.toString()));
    }
    async getClassReportCards(classId, semester) {
        const students = await this.reportCardsService['prisma'].student.findMany({
            where: { class_id: classId },
            include: {
                final_grades: {
                    where: { semester: parseInt(semester.toString()) },
                    include: { subject: true }
                }
            }
        });
        return students.map(student => ({
            student_id: student.id,
            nis: student.nis,
            full_name: student.full_name,
            has_report_card: student.final_grades.length > 0,
            subject_count: student.final_grades.length,
        }));
    }
};
exports.ReportCardsController = ReportCardsController;
__decorate([
    (0, common_1.Get)('student/:studentId/semester/:semester'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua'),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Param)('semester')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ReportCardsController.prototype, "getReportCardData", null);
__decorate([
    (0, common_1.Get)('student/:studentId/semester/:semester/pdf'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua'),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Param)('semester')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReportCardsController.prototype, "downloadReportCard", null);
__decorate([
    (0, common_1.Get)('class/:classId/semester/:semester'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('semester')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReportCardsController.prototype, "getClassReportCards", null);
exports.ReportCardsController = ReportCardsController = __decorate([
    (0, common_1.Controller)('report-cards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [report_cards_service_1.ReportCardsService])
], ReportCardsController);
//# sourceMappingURL=report-cards.controller.js.map