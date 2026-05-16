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
exports.AcademicCalendarController = void 0;
const common_1 = require("@nestjs/common");
const academic_calendar_service_1 = require("./academic-calendar.service");
const create_calendar_dto_1 = require("./dto/create-calendar.dto");
const update_calendar_dto_1 = require("./dto/update-calendar.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AcademicCalendarController = class AcademicCalendarController {
    academicCalendarService;
    constructor(academicCalendarService) {
        this.academicCalendarService = academicCalendarService;
    }
    create(createCalendarDto) {
        return this.academicCalendarService.create(createCalendarDto);
    }
    findAll() {
        return this.academicCalendarService.findAll();
    }
    findOne(id) {
        return this.academicCalendarService.findOne(id);
    }
    update(id, updateCalendarDto) {
        return this.academicCalendarService.update(id, updateCalendarDto);
    }
    remove(id) {
        return this.academicCalendarService.remove(id);
    }
};
exports.AcademicCalendarController = AcademicCalendarController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Administrator Utama'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calendar_dto_1.CreateCalendarDto]),
    __metadata("design:returntype", void 0)
], AcademicCalendarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicCalendarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicCalendarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_calendar_dto_1.UpdateCalendarDto]),
    __metadata("design:returntype", void 0)
], AcademicCalendarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicCalendarController.prototype, "remove", null);
exports.AcademicCalendarController = AcademicCalendarController = __decorate([
    (0, common_1.Controller)('academic-calendar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [academic_calendar_service_1.AcademicCalendarService])
], AcademicCalendarController);
//# sourceMappingURL=academic-calendar.controller.js.map