"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
const QRCode = __importStar(require("qrcode"));
const stream_1 = require("stream");
let ReportCardsService = class ReportCardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateReportCard(studentId, semester) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                batch: true,
                major: true,
                class: true,
                parents: true,
                final_grades: {
                    where: { semester },
                    include: { subject: true }
                },
                attendances: {
                    include: { schedule: { include: { subject: true } } }
                }
            }
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const finalGrades = student.final_grades;
        if (finalGrades.length === 0) {
            throw new common_1.NotFoundException('No grades found for this student/semester');
        }
        const attendanceBySubject = {};
        student.attendances.forEach(att => {
            const subjectName = att.schedule?.subject?.name || 'Unknown';
            if (!attendanceBySubject[subjectName]) {
                attendanceBySubject[subjectName] = { present: 0, total: 0 };
            }
            attendanceBySubject[subjectName].total++;
            if (att.status === 'present') {
                attendanceBySubject[subjectName].present++;
            }
        });
        const verificationData = JSON.stringify({
            student_id: student.id,
            nis: student.nis,
            semester,
            generated_at: new Date().toISOString()
        });
        const qrCodeDataUrl = await QRCode.toDataURL(verificationData, { width: 120 });
        const doc = new pdfkit_1.default({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });
        const stream = stream_1.Readable.from(doc);
        doc.fontSize(16).font('Helvetica-Bold').text('RAPOR PESERTA DIDIK', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('Rumah Gemilang Indonesia', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Semester: ${semester === 1 ? 'Ganjil' : 'Genap'}`, { align: 'center' });
        doc.text(`Tahun Ajaran: ${student.batch.name}`, { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(11).font('Helvetica-Bold').text('IDENTITAS PESERTA DIDIK');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        const studentInfo = [
            ['Nama', ':', student.full_name],
            ['NIS', ':', student.nis],
            ['Kelas', ':', student.class?.name || '-'],
            ['Jurusan', ':', student.major.name],
            ['Alamat', ':', student.address],
        ];
        studentInfo.forEach(([label, sep, value]) => {
            doc.text(label, 50, doc.y, { width: 100 });
            doc.text(sep, 150, doc.y, { width: 20 });
            doc.text(value, 170, doc.y);
            doc.moveDown(0.3);
        });
        doc.moveDown(0.5);
        if (student.parents && student.parents.length > 0) {
            const parent = student.parents[0];
            doc.fontSize(11).font('Helvetica-Bold').text('IDENTITAS ORANG TUA');
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica');
            doc.text('Nama Ayah', 50, doc.y, { width: 100 });
            doc.text(':', 150, doc.y, { width: 20 });
            doc.text(parent.father_name, 170, doc.y);
            doc.moveDown(0.3);
            doc.text('Nama Ibu', 50, doc.y, { width: 100 });
            doc.text(':', 150, doc.y, { width: 20 });
            doc.text(parent.mother_name, 170, doc.y);
            doc.moveDown(1);
        }
        doc.fontSize(11).font('Helvetica-Bold').text('NILAI AKADEMIK');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        const tableTop = doc.y;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('No', 50, tableTop, { width: 30, align: 'center' });
        doc.text('Mata Pelajaran', 80, tableTop, { width: 180 });
        doc.text('KKM', 260, tableTop, { width: 40, align: 'center' });
        doc.text('Nilai Akhir', 300, tableTop, { width: 70, align: 'right' });
        doc.text('Grade', 370, tableTop, { width: 50, align: 'center' });
        doc.text('Status', 420, tableTop, { width: 130, align: 'center' });
        doc.text('Deskripsi', 50, tableTop + 15, { width: 500 });
        doc.moveTo(50, tableTop + 30).lineTo(550, tableTop + 30).stroke();
        let yPos = tableTop + 40;
        finalGrades.forEach((grade, index) => {
            doc.fontSize(9).font('Helvetica');
            doc.text((index + 1).toString(), 50, yPos, { width: 30, align: 'center' });
            doc.text(grade.subject.name, 80, yPos, { width: 180 });
            doc.text((grade.subject.passing_grade || 75).toString(), 260, yPos, { width: 40, align: 'center' });
            doc.text(grade.final_score.toString(), 300, yPos, { width: 70, align: 'right' });
            doc.text(grade.grade_letter, 370, yPos, { width: 50, align: 'center' });
            const statusText = grade.is_passed ? 'Lulus' : 'Remedial';
            const statusColor = grade.is_passed ? '#22c55e' : '#ef4444';
            doc.fillColor(statusColor).text(statusText, 420, yPos, { width: 130, align: 'center' });
            doc.fillColor('#000000');
            const descY = yPos + 15;
            doc.fontSize(8).font('Helvetica');
            if (grade.description) {
                doc.text(grade.description, 50, descY, { width: 480, align: 'left' });
            }
            const rowHeight = grade.description ? 50 : 35;
            doc.moveTo(50, yPos + rowHeight).lineTo(550, yPos + rowHeight).stroke();
            yPos += rowHeight + 5;
        });
        doc.moveDown(1);
        doc.fontSize(11).font('Helvetica-Bold').text('RINGKASAN KEHADIRAN');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        let totalPresent = 0;
        let totalAbsent = 0;
        Object.entries(attendanceBySubject).forEach(([subject, data]) => {
            const absent = data.total - data.present;
            totalPresent += data.present;
            totalAbsent += absent;
            doc.text(`${subject}: ${data.present}/${data.total} pertemuan`, 50, doc.y);
            doc.moveDown(0.3);
        });
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').text(`Total: ${totalPresent}/${totalPresent + totalAbsent} kehadiran (${Math.round((totalPresent / (totalPresent + totalAbsent)) * 100)}%)`);
        doc.moveDown(2);
        const footerY = doc.y;
        if (qrCodeDataUrl) {
            doc.fontSize(9).font('Helvetica').text('Verifikasi:', 50, footerY);
            try {
                doc.fontSize(8).text('QR Code: ' + verificationData.substring(0, 50) + '...', 50, footerY + 15, { width: 150 });
            }
            catch (e) {
            }
        }
        const signX = 400;
        doc.fontSize(10).font('Helvetica').text('Mengetahui,', signX, footerY);
        doc.moveDown(0.3);
        doc.text('Orang Tua/Wali', signX, doc.y);
        doc.moveDown(2);
        doc.text('(_________________)', signX, doc.y);
        doc.moveDown(1);
        doc.text('Guru Wali Kelas', signX, doc.y);
        doc.moveDown(2);
        doc.text('(_________________)', signX, doc.y);
        doc.fontSize(8).font('Helvetica').text(`Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleDateString('id-ID')}`, 50, 750, { align: 'center' });
        const totalPages = doc.bufferedPageRange();
        for (let i = 0; i < totalPages.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).text(`Halaman ${i + 1} dari ${totalPages.count}`, 50, 780, { align: 'center' });
        }
        doc.end();
        return new common_1.StreamableFile(stream, {
            type: 'application/pdf',
            disposition: `attachment; filename="Rapor_${student.full_name.replace(/\s+/g, '_')}_Semester_${semester}.pdf"`
        });
    }
    async getReportCardData(studentId, semester) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                batch: true,
                major: true,
                class: true,
                parents: true,
                final_grades: {
                    where: { semester },
                    include: { subject: true },
                    orderBy: { subject: { name: 'asc' } }
                },
                attendances: {
                    include: { schedule: { include: { subject: true } } }
                }
            }
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const finalGrades = student.final_grades;
        if (finalGrades.length === 0) {
            throw new common_1.NotFoundException('No grades found for this student/semester');
        }
        const attendanceBySubject = {};
        student.attendances.forEach(att => {
            const subjectName = att.schedule?.subject?.name || 'Unknown';
            if (!attendanceBySubject[subjectName]) {
                attendanceBySubject[subjectName] = { present: 0, total: 0 };
            }
            attendanceBySubject[subjectName].total++;
            if (att.status === 'present') {
                attendanceBySubject[subjectName].present++;
            }
        });
        return {
            student: {
                id: student.id,
                nis: student.nis,
                full_name: student.full_name,
                class_name: student.class?.name,
                major_name: student.major.name,
                batch_name: student.batch.name,
                address: student.address,
            },
            parents: student.parents && student.parents.length > 0 ? {
                father_name: student.parents[0].father_name,
                mother_name: student.parents[0].mother_name,
                phone: student.parents[0].phone,
            } : null,
            semester,
            grades: finalGrades.map(g => ({
                subject_name: g.subject.name,
                final_score: Number(g.final_score),
                grade_letter: g.grade_letter,
                is_passed: g.is_passed,
                description: g.description,
                competencies_achieved: g.competencies_achieved,
            })),
            attendance: {
                by_subject: attendanceBySubject,
                total_present: Object.values(attendanceBySubject).reduce((acc, curr) => acc + curr.present, 0),
                total_meetings: Object.values(attendanceBySubject).reduce((acc, curr) => acc + curr.total, 0),
            },
            generated_at: new Date().toISOString()
        };
    }
};
exports.ReportCardsService = ReportCardsService;
exports.ReportCardsService = ReportCardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportCardsService);
//# sourceMappingURL=report-cards.service.js.map