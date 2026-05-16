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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const create_fee_dto_1 = require("./dto/create-fee.dto");
const update_fee_dto_1 = require("./dto/update-fee.dto");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_dto_1 = require("./dto/update-payment.dto");
const finance_query_dto_1 = require("./dto/finance-query.dto");
const audit_interceptor_1 = require("../common/interceptors/audit.interceptor");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    createFee(createFeeDto) {
        return this.financeService.createFee(createFeeDto);
    }
    findAllFees(query) {
        const { page, limit, ...filters } = query;
        return this.financeService.findAllFees({ page, limit }, filters);
    }
    findOneFee(id) {
        return this.financeService.findOneFee(id);
    }
    updateFee(id, updateFeeDto) {
        return this.financeService.updateFee(id, updateFeeDto);
    }
    removeFee(id) {
        return this.financeService.removeFee(id);
    }
    createPayment(createPaymentDto) {
        return this.financeService.createPayment(createPaymentDto);
    }
    findAllPayments(query) {
        const { page, limit, ...filters } = query;
        return this.financeService.findAllPayments({ page, limit }, filters);
    }
    findOnePayment(id) {
        return this.financeService.findOnePayment(id);
    }
    updatePayment(id, updatePaymentDto) {
        return this.financeService.updatePayment(id, updatePaymentDto);
    }
    removePayment(id) {
        return this.financeService.removePayment(id);
    }
    sendPaymentReminders() {
        return this.financeService.sendPaymentReminders();
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Post)('fees'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fee_dto_1.CreateFeeDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createFee", null);
__decorate([
    (0, common_1.Get)('fees'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara', 'Kepala Sekolah'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finance_query_dto_1.FinanceQueryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllFees", null);
__decorate([
    (0, common_1.Get)('fees/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara', 'Kepala Sekolah'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOneFee", null);
__decorate([
    (0, common_1.Patch)('fees/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_fee_dto_1.UpdateFeeDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateFee", null);
__decorate([
    (0, common_1.Delete)('fees/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "removeFee", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara', 'Kepala Sekolah'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finance_query_dto_1.FinanceQueryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllPayments", null);
__decorate([
    (0, common_1.Get)('payments/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara', 'Kepala Sekolah'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOnePayment", null);
__decorate([
    (0, common_1.Patch)('payments/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Delete)('payments/:id'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "removePayment", null);
__decorate([
    (0, common_1.Post)('remind'),
    (0, roles_decorator_1.Roles)('Administrator Utama', 'Bendahara'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "sendPaymentReminders", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)(audit_interceptor_1.AuditInterceptor),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map