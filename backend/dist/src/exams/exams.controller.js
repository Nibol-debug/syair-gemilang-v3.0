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
exports.ExamsController = void 0;
const common_1 = require("@nestjs/common");
const exams_service_1 = require("./exams.service");
const create_exam_dto_1 = require("./dto/create-exam.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let ExamsController = class ExamsController {
    examsService;
    constructor(examsService) {
        this.examsService = examsService;
    }
    getStats() {
        return this.examsService.getStats();
    }
    getRecentViolations(limit) {
        return this.examsService.getRecentViolations(limit ? parseInt(limit) : 10);
    }
    create(createExamDto) {
        return this.examsService.create(createExamDto);
    }
    findAll(pagination, major_id, subject_id, search) {
        return this.examsService.findAll(pagination, { major_id, subject_id, search });
    }
    findOne(id) {
        return this.examsService.findOne(id);
    }
    getMonitoring(id) {
        return this.examsService.getMonitoring(id);
    }
    async getQuestions(id) {
        const exam = await this.examsService.findOne(id);
        return exam.questions.map(q => ({
            ...q,
            options: q.options.map(o => ({ id: o.id, option_text: o.option_text }))
        }));
    }
    update(id, data) {
        return this.examsService.update(id, data);
    }
    remove(id) {
        return this.examsService.remove(id);
    }
    addQuestion(id, data) {
        return this.examsService.addQuestion(id, data);
    }
    updateQuestion(questionId, data) {
        return this.examsService.updateQuestion(questionId, data);
    }
    removeQuestion(questionId) {
        return this.examsService.deleteQuestion(questionId);
    }
};
exports.ExamsController = ExamsController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('violations'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "getRecentViolations", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('major_id')),
    __param(2, (0, common_1.Query)('subject_id')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, String, String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/monitoring'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "getMonitoring", null);
__decorate([
    (0, common_1.Get)(':id/questions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/questions'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Patch)('questions/:questionId'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('questionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)('questions/:questionId'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "removeQuestion", null);
exports.ExamsController = ExamsController = __decorate([
    (0, common_1.Controller)('exams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], ExamsController);
//# sourceMappingURL=exams.controller.js.map