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
exports.EmployeeAttendanceController = void 0;
const common_1 = require("@nestjs/common");
const employees_service_1 = require("./employees.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let EmployeeAttendanceController = class EmployeeAttendanceController {
    employeesService;
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    getDailyAttendance(date) {
        return this.employeesService.getAttendanceByDate(date || new Date().toISOString());
    }
    getMonthlyAttendance(month) {
        return this.employeesService.getMonthlyAttendance(month || new Date().toISOString().slice(0, 7));
    }
    recordSelfAttendance(req) {
        const employeeId = req.user.employee_id;
        if (!employeeId) {
            throw new Error('Akun Anda tidak terhubung dengan data pegawai.');
        }
        return this.employeesService.recordSelfAttendance(employeeId);
    }
    recordBulkAttendance(body) {
        return this.employeesService.recordBulkAttendance(body.date, body.attendances);
    }
};
exports.EmployeeAttendanceController = EmployeeAttendanceController;
__decorate([
    (0, common_1.Get)('daily'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Bendahara'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeAttendanceController.prototype, "getDailyAttendance", null);
__decorate([
    (0, common_1.Get)('monthly'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Bendahara'),
    __param(0, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeAttendanceController.prototype, "getMonthlyAttendance", null);
__decorate([
    (0, common_1.Post)('self'),
    (0, roles_decorator_1.Roles)('Guru Mata Pelajaran', 'Wali Kelas', 'Bendahara', 'Staf Sarpras', 'Administrator Utama'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeeAttendanceController.prototype, "recordSelfAttendance", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Kepala Sekolah', 'Bendahara'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeeAttendanceController.prototype, "recordBulkAttendance", null);
exports.EmployeeAttendanceController = EmployeeAttendanceController = __decorate([
    (0, common_1.Controller)('employee-attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeeAttendanceController);
//# sourceMappingURL=employee-attendance.controller.js.map