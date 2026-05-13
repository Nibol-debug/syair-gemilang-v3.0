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
exports.GradeAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GradeAnalysisService = class GradeAnalysisService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExamStatistics(examId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: {
                subject: true,
                questions: {
                    include: {
                        options: true,
                        answers: {
                            include: {
                                session: {
                                    include: {
                                        student: true,
                                        applicant: true
                                    }
                                }
                            }
                        }
                    }
                },
                sessions: {
                    include: {
                        student: true,
                        applicant: true
                    }
                }
            }
        });
        if (!exam) {
            throw new common_1.NotFoundException('Exam not found');
        }
        const questionStatistics = exam.questions.map((question) => {
            const totalAttempts = question.answers.length;
            let correctCount = 0;
            if (question.type === 'mcq') {
                const correctOption = question.options.find(opt => opt.is_correct);
                if (correctOption) {
                    correctCount = question.answers.filter(answer => answer.answer === correctOption.option_text).length;
                }
            }
            const correctPercentage = totalAttempts > 0
                ? (correctCount / totalAttempts) * 100
                : 0;
            let difficultyLevel;
            if (correctPercentage >= 70) {
                difficultyLevel = 'easy';
            }
            else if (correctPercentage >= 40) {
                difficultyLevel = 'medium';
            }
            else {
                difficultyLevel = 'hard';
            }
            let discriminationIndex;
            if (question.type === 'mcq' && totalAttempts >= 10) {
                discriminationIndex = this.calculateDiscriminationIndex(question);
            }
            return {
                id: question.id,
                question_text: question.question_text.substring(0, 100) + (question.question_text.length > 100 ? '...' : ''),
                type: question.type,
                difficulty: question.difficulty,
                total_attempts: totalAttempts,
                correct_count: correctCount,
                correct_percentage: Math.round(correctPercentage * 100) / 100,
                discrimination_index: discriminationIndex,
                difficulty_level: difficultyLevel,
            };
        });
        const allSessions = exam.sessions.filter(s => s.status === 'submitted' || s.status === 'blocked');
        const grades = await this.prisma.grade.findMany({
            where: { exam_id: examId },
            select: { score: true }
        });
        const scores = grades.map(g => Number(g.score));
        const averageScore = scores.length > 0
            ? scores.reduce((a, b) => a + b, 0) / scores.length
            : 0;
        const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
        const standardDeviation = scores.length > 0
            ? Math.sqrt(scores.map(x => Math.pow(x - averageScore, 2)).reduce((a, b) => a + b, 0) / scores.length)
            : 0;
        const gradeDistribution = this.calculateGradeDistribution(scores);
        return {
            exam_title: exam.title,
            subject_name: exam.subject.name,
            total_students: allSessions.length,
            average_score: Math.round(averageScore * 100) / 100,
            highest_score: Math.round(highestScore * 100) / 100,
            lowest_score: Math.round(lowestScore * 100) / 100,
            standard_deviation: Math.round(standardDeviation * 100) / 100,
            questions: questionStatistics,
            grade_distribution: gradeDistribution,
        };
    }
    async getClassSubjectAnalysis(classId, subjectId, batchId) {
        const classData = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                students: {
                    include: {
                        final_grades: {
                            where: { subject_id: subjectId },
                            orderBy: { semester: 'desc' }
                        }
                    }
                },
                major: {
                    include: {
                        subjects: true
                    }
                }
            }
        });
        if (!classData) {
            throw new common_1.NotFoundException('Class not found');
        }
        const studentGrades = classData.students.map(student => {
            const finalGrade = student.final_grades[0];
            return {
                id: student.id,
                nis: student.nis,
                full_name: student.full_name,
                final_score: finalGrade ? Number(finalGrade.final_score) : null,
                grade_letter: finalGrade?.grade_letter || '-',
                is_passed: finalGrade?.is_passed,
                semester: finalGrade?.semester,
            };
        });
        const validScores = studentGrades
            .filter(s => s.final_score !== null)
            .map(s => s.final_score);
        const averageScore = validScores.length > 0
            ? validScores.reduce((a, b) => a + b, 0) / validScores.length
            : 0;
        const passedCount = studentGrades.filter(s => s.is_passed === true).length;
        const remedialCount = studentGrades.filter(s => s.final_score !== null && s.is_passed === false).length;
        const pendingCount = studentGrades.filter(s => s.final_score === null).length;
        return {
            class_name: classData.name,
            subject_name: classData.major?.subjects.find(s => s.id === subjectId)?.name || 'Unknown',
            total_students: studentGrades.length,
            average_score: Math.round(averageScore * 100) / 100,
            passed_count: passedCount,
            remedial_count: remedialCount,
            pending_count: pendingCount,
            pass_percentage: validScores.length > 0
                ? Math.round((passedCount / validScores.length) * 100 * 100) / 100
                : 0,
            students: studentGrades,
            grade_distribution: this.calculateGradeDistribution(validScores),
        };
    }
    calculateDiscriminationIndex(question) {
        const answers = question.answers;
        if (answers.length < 10)
            return undefined;
        const correctOption = question.options.find((opt) => opt.is_correct);
        if (!correctOption)
            return undefined;
        const sessionScores = [];
        answers.forEach((answer) => {
            const existing = sessionScores.find(s => s.sessionId === answer.session_id);
            if (!existing) {
                sessionScores.push({
                    sessionId: answer.session_id,
                    isCorrect: answer.answer === correctOption.option_text,
                });
            }
        });
        sessionScores.sort((a, b) => {
            if (a.isCorrect && !b.isCorrect)
                return -1;
            if (!a.isCorrect && b.isCorrect)
                return 1;
            return 0;
        });
        const upperGroupSize = Math.floor(sessionScores.length * 0.27);
        const lowerGroupSize = Math.floor(sessionScores.length * 0.27);
        const upperGroup = sessionScores.slice(0, upperGroupSize);
        const lowerGroup = sessionScores.slice(-lowerGroupSize);
        const upperCorrectRatio = upperGroup.filter(s => s.isCorrect).length / upperGroup.length;
        const lowerCorrectRatio = lowerGroup.filter(s => s.isCorrect).length / lowerGroup.length;
        const discriminationIndex = upperCorrectRatio - lowerCorrectRatio;
        return Math.round(discriminationIndex * 100) / 100;
    }
    calculateGradeDistribution(scores) {
        if (scores.length === 0)
            return [];
        const ranges = [
            { min: 90, max: 100, label: '90-100 (A)' },
            { min: 80, max: 89, label: '80-89 (B)' },
            { min: 70, max: 79, label: '70-79 (C)' },
            { min: 60, max: 69, label: '60-69 (D)' },
            { min: 0, max: 59, label: '0-59 (E)' },
        ];
        return ranges.map(range => {
            const count = scores.filter(s => s >= range.min && s <= range.max).length;
            return {
                grade_range: range.label,
                count,
                percentage: Math.round((count / scores.length) * 100 * 100) / 100,
            };
        });
    }
    async getQuestionsForReview(examId) {
        const statistics = await this.getExamStatistics(examId);
        const needsReview = statistics.questions.filter(q => {
            const poorDiscrimination = q.discrimination_index !== undefined && q.discrimination_index < 0.2;
            const tooEasy = q.correct_percentage > 90;
            const tooHard = q.correct_percentage < 20;
            return poorDiscrimination || tooEasy || tooHard;
        });
        return {
            exam_title: statistics.exam_title,
            total_questions: statistics.questions.length,
            needs_review_count: needsReview.length,
            questions: needsReview,
        };
    }
};
exports.GradeAnalysisService = GradeAnalysisService;
exports.GradeAnalysisService = GradeAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradeAnalysisService);
//# sourceMappingURL=grade-analysis.service.js.map