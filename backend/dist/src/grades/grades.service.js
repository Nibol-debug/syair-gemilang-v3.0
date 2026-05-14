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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GradesService = class GradesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGradeComponents() {
        return this.prisma.gradeComponent.findMany();
    }
    async updateGradeComponent(data) {
        return this.prisma.gradeComponent.update({
            where: { id: data.id },
            data: {
                weight_percentage: new client_1.Prisma.Decimal(data.weight_percentage)
            }
        });
    }
    generateDescription(gradeLetter, finalScore, subjectName) {
        const descriptions = {
            'A': {
                description: `Siswa menunjukkan pemahaman yang sangat baik dalam ${subjectName}. Menguasai seluruh kompetensi dasar dengan sangat baik.`,
                competencies: 'Semua kompetensi dasar tercapai dengan sangat baik. Siswa mampu menganalisis, mengevaluasi, dan menciptakan solusi terkait materi pelajaran.'
            },
            'B': {
                description: `Siswa menunjukkan pemahaman yang baik dalam ${subjectName}. Menguasai sebagian besar kompetensi dasar dengan baik.`,
                competencies: 'Sebagian besar kompetensi dasar tercapai dengan baik. Siswa mampu memahami, menerapkan, dan menganalisis konsep-konsep dasar.'
            },
            'C': {
                description: `Siswa menunjukkan pemahaman yang cukup dalam ${subjectName}. Perlu peningkatan dalam beberapa kompetensi dasar.`,
                competencies: 'Kompetensi dasar tercapai pada level minimal. Siswa perlu lebih giat berlatih untuk meningkatkan pemahaman konseptual.'
            },
            'D': {
                description: `Siswa menunjukkan pemahaman yang kurang dalam ${subjectName}. Perlu remedial pada beberapa kompetensi dasar.`,
                competencies: 'Beberapa kompetensi dasar belum tercapai. Siswa memerlukan bimbingan khusus dan latihan tambahan.'
            },
            'E': {
                description: `Siswa belum menunjukkan pemahaman yang memadai dalam ${subjectName}. Wajib mengikuti remedial menyeluruh.`,
                competencies: 'Sebagian besar kompetensi dasar belum tercapai. Siswa memerlukan pendampingan intensif dan mengulang materi dasar.'
            }
        };
        const desc = descriptions[gradeLetter] || descriptions['E'];
        return {
            description: desc.description,
            competencies_achieved: desc.competencies
        };
    }
    async create(data) {
        const student = await this.prisma.student.findUnique({
            where: { id: data.student_id }
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return this.prisma.grade.create({
            data: {
                student_id: data.student_id,
                subject_id: data.subject_id,
                type: data.type,
                score: new client_1.Prisma.Decimal(data.score),
                weight: new client_1.Prisma.Decimal(data.weight || 1.0),
                exam_id: data.exam_id,
                major_id: student.major_id,
                batch_id: student.batch_id,
            }
        });
    }
    async findByStudent(studentId, pagination) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.grade.findMany({
                where: { student_id: studentId },
                skip,
                take: limit,
                include: { subject: true, exam: true },
                orderBy: { created_at: 'desc' }
            }),
            this.prisma.grade.count({ where: { student_id: studentId } }),
        ]);
        return {
            data,
            meta: { total, page, limit, last_page: Math.ceil(total / limit) },
        };
    }
    async finalizeGrade(data) {
        const grades = await this.prisma.grade.findMany({
            where: {
                student_id: data.student_id,
                subject_id: data.subject_id,
            }
        });
        if (grades.length === 0) {
            throw new common_1.BadRequestException('No grades found for this subject/student');
        }
        const components = await this.prisma.gradeComponent.findMany();
        const weights = {};
        components.forEach(c => {
            weights[c.name.toLowerCase()] = Number(c.weight_percentage) / 100;
        });
        const gradesByType = {};
        grades.forEach(g => {
            const type = g.type.toLowerCase();
            if (!gradesByType[type])
                gradesByType[type] = [];
            gradesByType[type].push(Number(g.score));
        });
        let finalScore = 0;
        Object.keys(gradesByType).forEach(type => {
            const avg = gradesByType[type].reduce((a, b) => a + b, 0) / gradesByType[type].length;
            const weight = weights[type] || 0;
            finalScore += avg * weight;
        });
        const subject = await this.prisma.subject.findUnique({
            where: { id: data.subject_id }
        });
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        let gradeLetter = 'E';
        if (finalScore >= 85)
            gradeLetter = 'A';
        else if (finalScore >= 75)
            gradeLetter = 'B';
        else if (finalScore >= 65)
            gradeLetter = 'C';
        else if (finalScore >= 50)
            gradeLetter = 'D';
        const isPassed = finalScore >= Number(subject.passing_grade);
        const student = await this.prisma.student.findUnique({
            where: { id: data.student_id }
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const { description, competencies_achieved } = this.generateDescription(gradeLetter, finalScore, subject.name);
        const existingFinal = await this.prisma.finalGrade.findFirst({
            where: {
                student_id: data.student_id,
                subject_id: data.subject_id,
                semester: data.semester
            }
        });
        if (existingFinal) {
            return this.prisma.finalGrade.update({
                where: { id: existingFinal.id },
                data: {
                    final_score: new client_1.Prisma.Decimal(finalScore),
                    grade_letter: gradeLetter,
                    is_passed: isPassed,
                    description,
                    competencies_achieved,
                }
            });
        }
        return this.prisma.finalGrade.create({
            data: {
                student_id: data.student_id,
                subject_id: data.subject_id,
                semester: data.semester,
                final_score: new client_1.Prisma.Decimal(finalScore),
                grade_letter: gradeLetter,
                is_passed: isPassed,
                description,
                competencies_achieved,
                major_id: student.major_id,
                batch_id: student.batch_id,
            }
        });
    }
    async finalizeClassGrades(data) {
        const students = await this.prisma.student.findMany({
            where: { class_id: data.class_id }
        });
        if (students.length === 0) {
            throw new common_1.NotFoundException('No students found in this class');
        }
        const results = [];
        for (const student of students) {
            try {
                const result = await this.finalizeGrade({
                    student_id: student.id,
                    subject_id: data.subject_id,
                    semester: data.semester
                });
                results.push(result);
            }
            catch (err) {
                continue;
            }
        }
        return {
            message: `Successfully finalized ${results.length} students out of ${students.length}`,
            finalized_count: results.length
        };
    }
    async getFinalReport(studentId) {
        return this.prisma.finalGrade.findMany({
            where: { student_id: studentId },
            include: { subject: true },
            orderBy: { semester: 'asc' }
        });
    }
    async findByClass(classId, subjectId) {
        const students = await this.prisma.student.findMany({
            where: { class_id: classId },
            include: {
                grades: {
                    where: { subject_id: subjectId },
                    orderBy: { created_at: 'desc' }
                },
                final_grades: {
                    where: { subject_id: subjectId }
                }
            }
        });
        return students.map(student => {
            const cbtGrade = student.grades.find(g => g.type === 'cbt');
            const assignmentGrade = student.grades.find(g => g.type === 'assignment');
            const finalGrade = student.final_grades[0];
            return {
                id: student.id,
                nis: student.nis,
                full_name: student.full_name,
                cbt_score: cbtGrade?.score || 0,
                assignment_score: assignmentGrade?.score || 0,
                final_score: finalGrade?.final_score || 0,
                status: finalGrade?.is_passed ? 'Lulus' : (finalGrade ? 'Remedial' : 'Pending'),
            };
        });
    }
    async getParentPortalData(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                final_grades: {
                    include: { subject: true },
                    orderBy: [{ semester: 'asc' }, { subject: { name: 'asc' } }]
                },
                grades: {
                    include: { subject: true, exam: true },
                    orderBy: { created_at: 'desc' }
                },
                class: true,
                major: true,
                batch: true
            }
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const gradesBySemester = {};
        student.final_grades.forEach(grade => {
            if (!gradesBySemester[grade.semester]) {
                gradesBySemester[grade.semester] = [];
            }
            gradesBySemester[grade.semester].push(Number(grade.final_score));
        });
        const chartData = Object.entries(gradesBySemester).map(([semester, scores]) => ({
            semester: `Semester ${semester}`,
            average: scores.reduce((a, b) => a + b, 0) / scores.length,
            semester_num: parseInt(semester)
        })).sort((a, b) => a.semester_num - b.semester_num);
        const recentGrades = student.grades.slice(0, 5).map(g => ({
            subject_name: g.subject.name,
            type: g.type,
            score: Number(g.score),
            date: g.created_at,
        }));
        const totalSubjects = student.final_grades.length;
        const passedSubjects = student.final_grades.filter(g => g.is_passed).length;
        const averageScore = student.final_grades.length > 0
            ? student.final_grades.reduce((acc, g) => acc + Number(g.final_score), 0) / student.final_grades.length
            : 0;
        return {
            student: {
                id: student.id,
                nis: student.nis,
                full_name: student.full_name,
                class_name: student.class?.name,
                major_name: student.major.name,
                batch_name: student.batch.name,
            },
            summary: {
                total_subjects: totalSubjects,
                passed_subjects: passedSubjects,
                average_score: Math.round(averageScore * 100) / 100,
                pass_percentage: totalSubjects > 0 ? Math.round((passedSubjects / totalSubjects) * 100) : 0,
            },
            chart_data: chartData,
            recent_grades: recentGrades,
            all_grades: student.final_grades.map(g => ({
                subject_name: g.subject.name,
                final_score: Number(g.final_score),
                grade_letter: g.grade_letter,
                is_passed: g.is_passed,
                semester: g.semester,
                description: g.description,
            })),
        };
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map