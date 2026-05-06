"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const exam_sessions_service_1 = require("./exam-sessions.service");
const exam_sessions_controller_1 = require("./exam-sessions.controller");
let ExamSessionsModule = class ExamSessionsModule {
};
exports.ExamSessionsModule = ExamSessionsModule;
exports.ExamSessionsModule = ExamSessionsModule = __decorate([
    (0, common_1.Module)({
        providers: [exam_sessions_service_1.ExamSessionsService],
        controllers: [exam_sessions_controller_1.ExamSessionsController]
    })
], ExamSessionsModule);
//# sourceMappingURL=exam-sessions.module.js.map