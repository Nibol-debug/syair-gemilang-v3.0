import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto, FinalizeGradeDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateGradeDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: data.student_id }
    });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.grade.create({
      data: {
        student_id: data.student_id,
        subject_id: data.subject_id,
        type: data.type,
        score: new Prisma.Decimal(data.score),
        weight: new Prisma.Decimal(data.weight || 1.0),
        exam_id: data.exam_id,
        major_id: student.major_id,
        batch_id: student.batch_id,
      }
    });
  }

  async findByStudent(studentId: string, pagination: PaginationDto) {
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

  async finalizeGrade(data: FinalizeGradeDto) {
    const grades = await this.prisma.grade.findMany({
      where: {
        student_id: data.student_id,
        subject_id: data.subject_id,
      }
    });

    if (grades.length === 0) {
      throw new BadRequestException('No grades found for this subject/student');
    }

    let totalScore = 0;
    let totalWeight = 0;

    grades.forEach(g => {
      const score = Number(g.score);
      const weight = Number(g.weight);
      totalScore += score * weight;
      totalWeight += weight;
    });

    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    let gradeLetter = 'E';
    if (finalScore >= 85) gradeLetter = 'A';
    else if (finalScore >= 75) gradeLetter = 'B';
    else if (finalScore >= 65) gradeLetter = 'C';
    else if (finalScore >= 50) gradeLetter = 'D';

    const isPassed = finalScore >= 75;

    const student = await this.prisma.student.findUnique({
      where: { id: data.student_id }
    });
    if (!student) throw new NotFoundException('Student not found');

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
          final_score: new Prisma.Decimal(finalScore),
          grade_letter: gradeLetter,
          is_passed: isPassed,
        }
      });
    }

    return this.prisma.finalGrade.create({
      data: {
        student_id: data.student_id,
        subject_id: data.subject_id,
        semester: data.semester,
        final_score: new Prisma.Decimal(finalScore),
        grade_letter: gradeLetter,
        is_passed: isPassed,
        major_id: student.major_id,
        batch_id: student.batch_id,
      }
    });
  }

  async getFinalReport(studentId: string) {
    return this.prisma.finalGrade.findMany({
      where: { student_id: studentId },
      include: { subject: true },
      orderBy: { semester: 'asc' }
    });
  }

  async findByClass(classId: string, subjectId: string) {
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
}
