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
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExamsService = class ExamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { questions, ...examData } = data;
        return this.prisma.exam.create({
            data: {
                ...examData,
                questions: questions ? {
                    create: questions.map((q) => ({
                        type: q.type,
                        question_text: q.question_text,
                        difficulty: q.difficulty,
                        options: q.options ? {
                            create: q.options
                        } : undefined
                    }))
                } : undefined
            },
            include: {
                questions: {
                    include: { options: true }
                }
            }
        });
    }
    async findAll(pagination, filters) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.major_id)
            where.major_id = filters.major_id;
        if (filters.subject_id)
            where.subject_id = filters.subject_id;
        if (filters.search) {
            where.title = { contains: filters.search };
        }
        const [data, total] = await Promise.all([
            this.prisma.exam.findMany({
                where,
                skip,
                take: limit,
                orderBy: { start_time: 'desc' },
                include: {
                    subject: true,
                    major: true,
                    _count: { select: { questions: true, sessions: true } }
                },
            }),
            this.prisma.exam.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, last_page: Math.ceil(total / limit) },
        };
    }
    async findOne(id, userRole) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: {
                subject: true,
                major: true,
                questions: {
                    include: { options: true }
                },
                _count: { select: { sessions: true } }
            },
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        if (userRole === 'Siswa' || userRole === 'Orang Tua') {
            const { token, questions, ...examPublicInfo } = exam;
            return examPublicInfo;
        }
        return exam;
    }
    async update(id, data) {
        return this.prisma.exam.update({
            where: { id },
            data,
            include: { subject: true, major: true }
        });
    }
    async remove(id) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: { sessions: { include: { answers: true, logs: true } }, questions: { include: { options: true, answers: true } } }
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        for (const session of exam.sessions) {
            await this.prisma.studentAnswer.deleteMany({ where: { session_id: session.id } });
            await this.prisma.examLog.deleteMany({ where: { session_id: session.id } });
        }
        await this.prisma.examSession.deleteMany({ where: { exam_id: id } });
        for (const q of exam.questions) {
            await this.prisma.studentAnswer.deleteMany({ where: { question_id: q.id } });
            await this.prisma.questionOption.deleteMany({ where: { question_id: q.id } });
        }
        await this.prisma.question.deleteMany({ where: { exam_id: id } });
        await this.prisma.grade.deleteMany({ where: { exam_id: id } });
        return this.prisma.exam.delete({ where: { id } });
    }
    async getStats() {
        const now = new Date();
        const [totalExams, activeExams, ongoingSessions, todayViolations, totalQuestions] = await Promise.all([
            this.prisma.exam.count(),
            this.prisma.exam.count({
                where: {
                    start_time: { lte: now },
                    end_time: { gte: now }
                }
            }),
            this.prisma.examSession.count({
                where: { status: 'ongoing' }
            }),
            this.prisma.examLog.count({
                where: {
                    timestamp: {
                        gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    }
                }
            }),
            this.prisma.question.count()
        ]);
        return { totalExams, activeExams, ongoingSessions, todayViolations, totalQuestions };
    }
    async getMonitoring(examId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: { subject: true, major: true }
        });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        const sessions = await this.prisma.examSession.findMany({
            where: { exam_id: examId },
            include: {
                student: { select: { id: true, full_name: true, nis: true, class: { select: { name: true } } } },
                applicant: { select: { id: true, full_name: true } },
                _count: { select: { answers: true, logs: true } }
            },
            orderBy: { start_time: 'desc' }
        });
        return { exam, sessions };
    }
    async getRecentViolations(limit = 10) {
        return this.prisma.examLog.findMany({
            take: limit,
            orderBy: { timestamp: 'desc' },
            include: {
                session: {
                    include: {
                        student: { select: { full_name: true, nis: true, class: { select: { name: true } } } },
                        applicant: { select: { full_name: true } },
                        exam: { select: { title: true } }
                    }
                }
            }
        });
    }
    async addQuestion(examId, data) {
        const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
        if (!exam)
            throw new common_1.NotFoundException('Exam not found');
        if (new Date() >= new Date(exam.start_time)) {
            throw new common_1.ForbiddenException('Cannot add questions after the exam has started.');
        }
        const { options, ...questionData } = data;
        return this.prisma.question.create({
            data: {
                ...questionData,
                exam: { connect: { id: examId } },
                options: options ? {
                    create: options
                } : undefined
            },
            include: { options: true }
        });
    }
    async updateQuestion(questionId, data) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { exam: true }
        });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (new Date() >= new Date(question.exam.start_time)) {
            throw new common_1.ForbiddenException('Cannot update questions after the exam has started.');
        }
        const { options, ...questionData } = data;
        if (options) {
            await this.prisma.questionOption.deleteMany({
                where: { question_id: questionId }
            });
        }
        return this.prisma.question.update({
            where: { id: questionId },
            data: {
                ...questionData,
                options: options ? {
                    create: options
                } : undefined
            },
            include: { options: true }
        });
    }
    async deleteQuestion(questionId) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { exam: true }
        });
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        if (new Date() >= new Date(question.exam.start_time)) {
            throw new common_1.ForbiddenException('Cannot delete questions after the exam has started.');
        }
        await this.prisma.studentAnswer.deleteMany({ where: { question_id: questionId } });
        await this.prisma.questionOption.deleteMany({ where: { question_id: questionId } });
        return this.prisma.question.delete({
            where: { id: questionId }
        });
    }
    async getSessionQuestions(sessionId) {
        const session = await this.prisma.examSession.findUnique({
            where: { id: sessionId },
            include: {
                exam: {
                    include: {
                        questions: {
                            include: {
                                options: true
                            }
                        }
                    }
                },
                answers: true,
                student: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.status !== 'ongoing') {
            throw new common_1.ForbiddenException('Exam session is not active. Status: ' + session.status);
        }
        const now = new Date();
        const sessionEndTime = new Date(session.end_time || session.start_time.getTime() + (session.exam.duration * 60000));
        if (now > sessionEndTime) {
            throw new common_1.ForbiddenException('Exam time has ended');
        }
        const shuffledQuestions = this.shuffleArray([...session.exam.questions]);
        shuffledQuestions.forEach(q => {
            q.options = this.shuffleArray([...q.options]);
        });
        return shuffledQuestions.map(q => ({
            id: q.id,
            exam_id: q.exam_id,
            type: q.type,
            question_text: q.question_text,
            difficulty: q.difficulty,
            options: q.options.map(o => ({
                id: o.id,
                option_text: o.option_text
            }))
        }));
    }
    async getSessionAnswersDetail(sessionId) {
        const session = await this.prisma.examSession.findUnique({
            where: { id: sessionId },
            include: {
                exam: {
                    include: {
                        questions: {
                            include: { options: true }
                        }
                    }
                },
                answers: true,
                student: { select: { full_name: true, nis: true } },
                applicant: { select: { full_name: true } }
            }
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        const questionsWithAnswers = session.exam.questions.map(q => {
            const answer = session.answers.find(a => a.question_id === q.id);
            return {
                ...q,
                student_answer: answer || null
            };
        });
        return {
            session: {
                id: session.id,
                status: session.status,
                student: session.student,
                applicant: session.applicant,
                exam_title: session.exam.title
            },
            questions: questionsWithAnswers
        };
    }
    async gradeEssay(answerId, score) {
        const answer = await this.prisma.studentAnswer.findUnique({
            where: { id: answerId },
            include: { session: true }
        });
        if (!answer)
            throw new common_1.NotFoundException('Answer not found');
        await this.prisma.studentAnswer.update({
            where: { id: answerId },
            data: { score: score }
        });
        return this.recalculateSessionScore(answer.session_id);
    }
    async recalculateSessionScore(sessionId) {
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
        let totalPoints = 0;
        const totalQuestions = session.exam.questions.length;
        session.exam.questions.forEach((q) => {
            const studentAnswer = session.answers.find((a) => a.question_id === q.id);
            if (!studentAnswer)
                return;
            if (q.type === 'mcq') {
                const correctOption = q.options.find((o) => o.is_correct);
                if (correctOption && studentAnswer.answer === correctOption.option_text) {
                    totalPoints += 1;
                }
            }
            else if (q.type === 'essay') {
                totalPoints += Number(studentAnswer.score || 0);
            }
        });
        const finalScore = totalQuestions > 0 ? (totalPoints / totalQuestions) * 100 : 0;
        const existingGrade = await this.prisma.grade.findFirst({
            where: {
                exam_id: session.exam_id,
                OR: [
                    { student_id: session.student_id },
                    { applicant_id: session.applicant_id }
                ]
            }
        });
        if (existingGrade) {
            await this.prisma.grade.update({
                where: { id: existingGrade.id },
                data: { score: finalScore }
            });
        }
        return { score: finalScore, total_points: totalPoints, total_questions: totalQuestions };
    }
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map