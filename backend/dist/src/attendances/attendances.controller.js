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
exports.AttendancesController = void 0;
const common_1 = require("@nestjs/common");
const attendances_service_1 = require("./attendances.service");
const create_attendance_dto_1 = require("./dto/create-attendance.dto");
const update_attendance_dto_1 = require("./dto/update-attendance.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AttendancesController = class AttendancesController {
    attendancesService;
    constructor(attendancesService) {
        this.attendancesService = attendancesService;
    }
    bulkCreate(data) {
        return this.attendancesService.bulkCreate(data);
    }
    findByClass(classId, date) {
        return this.attendancesService.findByClass(classId, new Date(date));
    }
    getSummary(class_id, month) {
        return this.attendancesService.getSummary(class_id, month);
    }
    findBySchedule(scheduleId, date) {
        return this.attendancesService.findBySchedule(scheduleId, new Date(date));
    }
    update(id, updateAttendanceDto) {
        return this.attendancesService.update(id, updateAttendanceDto);
    }
    remove(id) {
        return this.attendancesService.remove(id);
    }
};
exports.AttendancesController = AttendancesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.BulkCreateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)('class/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas', 'Kepala Sekolah'),
    __param(0, (0, common_1.Query)('class_id')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('schedule/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findBySchedule", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "remove", null);
exports.AttendancesController = AttendancesController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendances_service_1.AttendancesService])
], AttendancesController);
//# sourceMappingURL=attendances.controller.js.map