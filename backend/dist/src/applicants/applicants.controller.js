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
exports.ApplicantsController = void 0;
const common_1 = require("@nestjs/common");
const applicants_service_1 = require("./applicants.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const create_applicant_dto_1 = require("./dto/create-applicant.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let ApplicantsController = class ApplicantsController {
    applicantsService;
    constructor(applicantsService) {
        this.applicantsService = applicantsService;
    }
    create(createApplicantDto) {
        return this.applicantsService.create(createApplicantDto);
    }
    uploadDocument(file) {
        return {
            url: `/uploads/applicants/${file.filename}`,
        };
    }
    findAll(query) {
        return this.applicantsService.findAll(query);
    }
    findOne(id) {
        return this.applicantsService.findOne(id);
    }
    update(id, data) {
        return this.applicantsService.update(id, data);
    }
    verify(id, status) {
        return this.applicantsService.verify(id, status);
    }
    remove(id) {
        return this.applicantsService.remove(id);
    }
};
exports.ApplicantsController = ApplicantsController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_applicant_dto_1.CreateApplicantDto]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload-document'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/applicants',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Bendahara'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Bendahara'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Administrator Utama'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "verify", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Administrator Utama'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "remove", null);
exports.ApplicantsController = ApplicantsController = __decorate([
    (0, common_1.Controller)('applicants'),
    __metadata("design:paramtypes", [applicants_service_1.ApplicantsService])
], ApplicantsController);
//# sourceMappingURL=applicants.controller.js.map