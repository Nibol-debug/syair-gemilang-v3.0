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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExamSessionsService = class ExamSessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startExam(studentId, examId, data) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: { questions: true }
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        if (exam.token !== data.token) {
            throw new common_1.BadRequestException('Invalid exam token');
        }
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true }
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        if (student.major_id !== exam.major_id) {
            throw new common_1.ForbiddenException('You are not allowed to take this exam (Major mismatch)');
        }
        const now = new Date();
        if (now < exam.start_time || now > exam.end_time) {
            throw new common_1.BadRequestException('Exam is not currently active');
        }
        if (student.user && data.device_id) {
            const activeDevices = await this.prisma.userDevice.findMany({
                where: { user_id: student.user.id, is_active: true }
            });
            if (activeDevices.length > 0) {
                const isDeviceAllowed = activeDevices.some(d => d.device_id === data.device_id);
                if (!isDeviceAllowed) {
                    throw new common_1.ForbiddenException('Akun Anda terkunci pada perangkat lain. Silakan hubungi Administrator untuk mereset perangkat.');
                }
            }
            else {
                await this.prisma.userDevice.create({
                    data: {
                        user_id: student.user.id,
                        device_id: data.device_id,
                        is_active: true
                    }
                });
            }
        }
        const existing = await this.prisma.examSession.findFirst({
            where: { student_id: studentId, exam_id: examId }
        });
        if (existing) {
            if (existing.status === 'submitted')
                throw new common_1.BadRequestException('You have already submitted this exam');
            return existing;
        }
        return this.prisma.examSession.create({
            data: {
                exam_id: examId,
                student_id: studentId,
                status: 'ongoing',
                device_id: data.device_id,
            }
        });
    }
    async submitAnswer(sessionId, data) {
        const existing = await this.prisma.studentAnswer.findFirst({
            where: { session_id: sessionId, question_id: data.question_id }
        });
        if (existing) {
            return this.prisma.studentAnswer.update({
                where: { id: existing.id },
                data: { answer: data.answer },
            });
        }
        return this.prisma.studentAnswer.create({
            data: {
                session_id: sessionId,
                question_id: data.question_id,
                answer: data.answer,
            }
        });
    }
    async logViolation(sessionId, data) {
        const log = await this.prisma.examLog.create({
            data: {
                session_id: sessionId,
                type: data.type,
            }
        });
        const violationCount = await this.prisma.examLog.count({
            where: { session_id: sessionId }
        });
        if (violationCount >= 3) {
            const session = await this.prisma.examSession.findUnique({ where: { id: sessionId } });
            if (session && session.status !== 'submitted') {
                await this.finalizeExam(sessionId);
            }
        }
        return log;
    }
    async finalizeExam(sessionId) {
        const session = await this.prisma.examSession.findUnique({
            where: { id: sessionId },
            include: {
                exam: {
                    include: {
                        questions: { include: { options: true } }
                    }
                },
                answers: true
            }
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        if (session.status === 'submitted')
            throw new common_1.BadRequestException('Exam already submitted');
        let score = 0;
        let totalMcq = 0;
        session.exam.questions.forEach((q) => {
            if (q.type === 'mcq') {
                totalMcq++;
                const studentAnswer = session.answers.find((a) => a.question_id === q.id);
                const correctOption = q.options.find((o) => o.is_correct);
                if (studentAnswer && correctOption && studentAnswer.answer === correctOption.option_text) {
                    score++;
                }
            }
        });
        const finalScore = totalMcq > 0 ? (score / totalMcq) * 100 : 0;
        await this.prisma.examSession.update({
            where: { id: sessionId },
            data: { status: 'submitted', end_time: new Date() }
        });
        const student = await this.prisma.student.findUnique({ where: { id: session.student_id } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        await this.prisma.grade.create({
            data: {
                student_id: session.student_id,
                subject_id: session.exam.subject_id,
                exam_id: session.exam.id,
                type: 'cbt',
                score: finalScore,
                weight: 1.0,
                major_id: session.exam.major_id,
                batch_id: student.batch_id,
            }
        });
        return { score: finalScore, total_correct: score, total_questions: totalMcq };
    }
};
exports.ExamSessionsService = ExamSessionsService;
exports.ExamSessionsService = ExamSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamSessionsService);
//# sourceMappingURL=exam-sessions.service.js.map