import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { Readable } from 'stream';

@Injectable()
export class ReportCardsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate PDF rapor untuk siswa tertentu
   */
  async generateReportCard(studentId: string, semester: number): Promise<StreamableFile> {
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
      throw new NotFoundException('Student not found');
    }

    const finalGrades = student.final_grades;
    if (finalGrades.length === 0) {
      throw new NotFoundException('No grades found for this student/semester');
    }

    // Calculate attendance summary
    const attendanceBySubject: Record<string, { present: number; total: number }> = {};
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

    // Generate QR Code for verification
    const verificationData = JSON.stringify({
      student_id: student.id,
      nis: student.nis,
      semester,
      generated_at: new Date().toISOString()
    });
    const qrCodeDataUrl = await QRCode.toDataURL(verificationData, { width: 120 });

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    const stream = Readable.from(doc);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('RAPOR PESERTA DIDIK', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Rumah Gemilang Indonesia', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Semester: ${semester === 1 ? 'Ganjil' : 'Genap'}`, { align: 'center' });
    doc.text(`Tahun Ajaran: ${student.batch.name}`, { align: 'center' });
    doc.moveDown(1);

    // Student Info
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

    // Parent Info
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

    // Grades Table
    doc.fontSize(11).font('Helvetica-Bold').text('NILAI AKADEMIK');
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table Header
    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('No', 50, tableTop, { width: 40, align: 'center' });
    doc.text('Mata Pelajaran', 90, tableTop, { width: 200 });
    doc.text('Nilai Akhir', 290, tableTop, { width: 80, align: 'right' });
    doc.text('Grade', 370, tableTop, { width: 60, align: 'center' });
    doc.text('Status', 430, tableTop, { width: 100, align: 'center' });
    doc.text('Deskripsi', 50, tableTop + 15, { width: 480 });

    // Table Lines
    doc.moveTo(50, tableTop + 30).lineTo(550, tableTop + 30).stroke();

    // Table Content
    let yPos = tableTop + 40;
    finalGrades.forEach((grade, index) => {
      doc.fontSize(9).font('Helvetica');
      doc.text((index + 1).toString(), 50, yPos, { width: 40, align: 'center' });
      doc.text(grade.subject.name, 90, yPos, { width: 200 });
      doc.text(grade.final_score.toString(), 290, yPos, { width: 80, align: 'right' });
      doc.text(grade.grade_letter, 370, yPos, { width: 60, align: 'center' });
      
      const statusText = grade.is_passed ? 'Lulus' : 'Remedial';
      const statusColor = grade.is_passed ? '#22c55e' : '#ef4444';
      doc.fillColor(statusColor).text(statusText, 430, yPos, { width: 100, align: 'center' });
      doc.fillColor('#000000');

      // Description (may need multiple lines)
      const descY = yPos + 15;
      doc.fontSize(8).font('Helvetica');
      if (grade.description) {
        doc.text(grade.description, 50, descY, { width: 480, align: 'left' });
      }

      // Row line
      const rowHeight = grade.description ? 50 : 35;
      doc.moveTo(50, yPos + rowHeight).lineTo(550, yPos + rowHeight).stroke();
      yPos += rowHeight + 5;
    });

    doc.moveDown(1);

    // Attendance Summary
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

    // QR Code & Signature
    const footerY = doc.y;
    
    // QR Code
    if (qrCodeDataUrl) {
      doc.fontSize(9).font('Helvetica').text('Verifikasi:', 50, footerY);
      try {
        // Note: QRCode image embedding would need proper base64 handling
        // For now, we'll skip the actual image embedding
        doc.fontSize(8).text('QR Code: ' + verificationData.substring(0, 50) + '...', 50, footerY + 15, { width: 150 });
      } catch (e) {
        // Skip QR if embedding fails
      }
    }

    // Signature (Right side)
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

    // Footer
    doc.fontSize(8).font('Helvetica').text(
      `Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleDateString('id-ID')}`,
      50,
      750,
      { align: 'center' }
    );

    // Add page numbers if needed
    const totalPages = doc.bufferedPageRange();
    for (let i = 0; i < totalPages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).text(
        `Halaman ${i + 1} dari ${totalPages.count}`,
        50,
        780,
        { align: 'center' }
      );
    }

    doc.end();

    return new StreamableFile(stream, {
      type: 'application/pdf',
      disposition: `attachment; filename="Rapor_${student.full_name.replace(/\s+/g, '_')}_Semester_${semester}.pdf"`
    });
  }

  /**
   * Get data rapor (JSON format untuk preview)
   */
  async getReportCardData(studentId: string, semester: number) {
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
      throw new NotFoundException('Student not found');
    }

    const finalGrades = student.final_grades;
    if (finalGrades.length === 0) {
      throw new NotFoundException('No grades found for this student/semester');
    }

    // Calculate attendance
    const attendanceBySubject: Record<string, { present: number; total: number }> = {};
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
}
