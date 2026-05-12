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
exports.MajorsController = void 0;
const common_1 = require("@nestjs/common");
const majors_service_1 = require("./majors.service");
const create_major_dto_1 = require("./dto/create-major.dto");
const update_major_dto_1 = require("./dto/update-major.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let MajorsController = class MajorsController {
    majorsService;
    constructor(majorsService) {
        this.majorsService = majorsService;
    }
    create(createMajorDto) {
        return this.majorsService.create(createMajorDto);
    }
    findAll(paginationDto) {
        return this.majorsService.findAll(paginationDto);
    }
    findOne(id) {
        return this.majorsService.findOne(id);
    }
    update(id, updateMajorDto) {
        return this.majorsService.update(id, updateMajorDto);
    }
    remove(id) {
        return this.majorsService.remove(id);
    }
};
exports.MajorsController = MajorsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_major_dto_1.CreateMajorDto]),
    __metadata("design:returntype", void 0)
], MajorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MajorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MajorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_major_dto_1.UpdateMajorDto]),
    __metadata("design:returntype", void 0)
], MajorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MajorsController.prototype, "remove", null);
exports.MajorsController = MajorsController = __decorate([
    (0, common_1.Controller)('majors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [majors_service_1.MajorsService])
], MajorsController);
//# sourceMappingURL=majors.controller.js.map