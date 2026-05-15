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
exports.RemedialController = void 0;
const common_1 = require("@nestjs/common");
const remedial_service_1 = require("./remedial.service");
const remedial_dto_1 = require("./dto/remedial.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let RemedialController = class RemedialController {
    remedialService;
    constructor(remedialService) {
        this.remedialService = remedialService;
    }
    getStudentsNeedingRemedial(subjectId, classId, semester) {
        return this.remedialService.getStudentsNeedingRemedial(subjectId, classId, semester ? parseInt(semester) : undefined);
    }
    getStats() {
        return this.remedialService.getStats();
    }
    findAll(status, subjectId, studentId) {
        return this.remedialService.findAll({ status, subject_id: subjectId, student_id: studentId });
    }
    findOne(id) {
        return this.remedialService.findOne(id);
    }
    create(createRemedialDto) {
        return this.remedialService.create(createRemedialDto);
    }
    schedule(id, data) {
        return this.remedialService.schedule(id, data);
    }
    updateScore(id, data) {
        return this.remedialService.updateScore(id, data);
    }
    remove(id) {
        return this.remedialService.remove(id);
    }
};
exports.RemedialController = RemedialController;
__decorate([
    (0, common_1.Get)('needs'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Query)('subject_id')),
    __param(1, (0, common_1.Query)('class_id')),
    __param(2, (0, common_1.Query)('semester')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "getStudentsNeedingRemedial", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('subject_id')),
    __param(2, (0, common_1.Query)('student_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [remedial_dto_1.CreateRemedialDto]),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/schedule'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, remedial_dto_1.ScheduleRemedialDto]),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "schedule", null);
__decorate([
    (0, common_1.Put)(':id/score'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, remedial_dto_1.UpdateRemedialScoreDto]),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "updateScore", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RemedialController.prototype, "remove", null);
exports.RemedialController = RemedialController = __decorate([
    (0, common_1.Controller)('remedial'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [remedial_service_1.RemedialService])
], RemedialController);
//# sourceMappingURL=remedial.controller.js.map