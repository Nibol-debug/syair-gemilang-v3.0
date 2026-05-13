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
    async startExam(params, data) {
        const { studentId, applicantId, examId } = params;
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: { questions: true }
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        if (exam.token !== data.token) {
            throw new common_1.BadRequestException('Invalid exam token');
        }
        let userId;
        if (studentId) {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { user: true }
            });
            if (!student)
                throw new common_1.NotFoundException('Student not found');
            if (student.major_id !== exam.major_id) {
                throw new common_1.ForbiddenException('You are not allowed to take this exam (Major mismatch)');
            }
            userId = student.user?.id;
        }
        else if (applicantId) {
            const applicant = await this.prisma.applicant.findUnique({ where: { id: applicantId } });
            if (!applicant)
                throw new common_1.NotFoundException('Applicant not found');
            if (applicant.major_id !== exam.major_id) {
                throw new common_1.ForbiddenException('You are not allowed to take this exam (Major mismatch)');
            }
            if (applicant.status !== 'verified') {
                throw new common_1.ForbiddenException('Pendaftaran Anda belum diverifikasi untuk mengikuti ujian.');
            }
        }
        else {
            throw new common_1.BadRequestException('Missing student_id or applicant_id');
        }
        const now = new Date();
        if (now < exam.start_time || now > exam.end_time) {
            throw new common_1.BadRequestException('Exam is not currently active');
        }
        if (userId && data.device_id) {
            const activeDevices = await this.prisma.userDevice.findMany({
                where: { user_id: userId, is_active: true }
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
                        user_id: userId,
                        device_id: data.device_id,
                        is_active: true
                    }
                });
            }
        }
        const existing = await this.prisma.examSession.findFirst({
            where: {
                OR: [
                    { student_id: studentId, exam_id: examId },
                    { applicant_id: applicantId, exam_id: examId }
                ]
            },
            include: { answers: true, logs: true }
        });
        if (existing) {
            if (existing.status === 'submitted')
                throw new common_1.BadRequestException('You have already submitted this exam');
            if (existing.status === 'blocked')
                throw new common_1.ForbiddenException('Sesi ujian Anda telah diblokir karena pelanggaran.');
            return existing;
        }
        return this.prisma.examSession.create({
            data: {
                exam_id: examId,
                student_id: studentId,
                applicant_id: applicantId,
                status: 'ongoing',
                device_id: data.device_id,
                warning_count: 0,
            }
        });
    }
    async submitAnswer(sessionId, data) {
        const session = await this.prisma.examSession.findUnique({ where: { id: sessionId } });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        if (session.status !== 'ongoing')
            throw new common_1.BadRequestException('Session is not active');
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
        const session = await this.prisma.examSession.findUnique({ where: { id: sessionId } });
        if (!session || session.status !== 'ongoing')
            return { ignored: true };
        const log = await this.prisma.examLog.create({
            data: {
                session_id: sessionId,
                type: data.type,
                description: data.description || null,
            }
        });
        const updatedSession = await this.prisma.examSession.update({
            where: { id: sessionId },
            data: { warning_count: { increment: 1 } }
        });
        if (updatedSession.warning_count >= 3) {
            if (updatedSession.status === 'ongoing') {
                await this.finalizeExam(sessionId, true);
                return { ...log, auto_submitted: true, reason: 'Batas pelanggaran tercapai (3x)' };
            }
        }
        return { ...log, warning_count: updatedSession.warning_count };
    }
    async getSessionDetail(sessionId) {
        const session = await this.prisma.examSession.findUnique({
            where: { id: sessionId },
            include: {
                student: { select: { full_name: true, nis: true } },
                applicant: { select: { full_name: true } },
                exam: { select: { title: true, duration: true } },
                answers: { include: { question: { select: { question_text: true, type: true } } } },
                logs: { orderBy: { timestamp: 'desc' } }
            }
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        return session;
    }
    async forceSubmit(sessionId) {
        return this.finalizeExam(sessionId, true);
    }
    async finalizeExam(sessionId, isForced = false) {
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
            data: {
                status: isForced ? 'blocked' : 'submitted',
                end_time: new Date()
            }
        });
        if (isForced) {
            await this.prisma.examLog.create({
                data: {
                    session_id: sessionId,
                    type: 'auto_submit',
                    description: 'Ujian dikumpulkan otomatis karena pelanggaran atau force submit admin.'
                }
            });
        }
        let batchId;
        if (session.student_id) {
            const student = await this.prisma.student.findUnique({ where: { id: session.student_id } });
            if (!student)
                throw new common_1.NotFoundException('Student not found');
            batchId = student.batch_id;
        }
        else {
            const activeBatch = await this.prisma.batch.findFirst({ where: { is_active: true } });
            if (!activeBatch)
                throw new Error('No active batch found');
            batchId = activeBatch.id;
        }
        await this.prisma.grade.create({
            data: {
                student_id: session.student_id,
                applicant_id: session.applicant_id,
                subject_id: session.exam.subject_id,
                exam_id: session.exam.id,
                type: 'cbt',
                score: finalScore,
                weight: 1.0,
                major_id: session.exam.major_id,
                batch_id: batchId,
            }
        });
        return { score: finalScore, total_correct: score, total_questions: totalMcq, forced: isForced };
    }
};
exports.ExamSessionsService = ExamSessionsService;
exports.ExamSessionsService = ExamSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamSessionsService);
//# sourceMappingURL=exam-sessions.service.js.map