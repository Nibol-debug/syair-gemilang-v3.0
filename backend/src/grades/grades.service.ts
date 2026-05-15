import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto, FinalizeGradeDto, UpdateGradeComponentDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async getGradeComponents() {
    return this.prisma.gradeComponent.findMany();
  }

  async updateGradeComponent(data: UpdateGradeComponentDto) {
    return this.prisma.gradeComponent.update({
      where: { id: data.id },
      data: {
        weight_percentage: new Prisma.Decimal(data.weight_percentage)
      }
    });
  }

  /**
   * Generate deskripsi otomatis berdasarkan nilai dan grade letter
   */
  private generateDescription(gradeLetter: string, finalScore: number, subjectName: string): { description: string; competencies_achieved: string } {
    const descriptions: Record<string, { description: string; competencies: string }> = {
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

    // Fetch weights from GradeComponent
    const components = await this.prisma.gradeComponent.findMany();
    const weights: Record<string, number> = {};
    components.forEach(c => {
      weights[c.name.toLowerCase()] = Number(c.weight_percentage) / 100;
    });

    // Group grades by type
    const gradesByType: Record<string, number[]> = {};
    grades.forEach(g => {
      const type = g.type.toLowerCase();
      if (!gradesByType[type]) gradesByType[type] = [];
      gradesByType[type].push(Number(g.score));
    });

    let finalScore = 0;

    // Calculate weighted average
    Object.keys(gradesByType).forEach(type => {
      const avg = gradesByType[type].reduce((a, b) => a + b, 0) / gradesByType[type].length;
      const weight = weights[type] || 0;
      finalScore += avg * weight;
    });

    // Get subject for KKM and description
    const subject = await this.prisma.subject.findUnique({
      where: { id: data.subject_id }
    });
    if (!subject) throw new NotFoundException('Subject not found');

    let gradeLetter = 'E';
    if (finalScore >= 85) gradeLetter = 'A';
    else if (finalScore >= 75) gradeLetter = 'B';
    else if (finalScore >= 65) gradeLetter = 'C';
    else if (finalScore >= 50) gradeLetter = 'D';

    const isPassed = finalScore >= Number(subject.passing_grade);

    const student = await this.prisma.student.findUnique({
      where: { id: data.student_id }
    });
    if (!student) throw new NotFoundException('Student not found');

    // Generate automatic description
    const { description, competencies_achieved } = this.generateDescription(
      gradeLetter,
      finalScore,
      subject.name
    );

    const existingFinal = await this.prisma.finalGrade.findFirst({
      where: {
        student_id: data.student_id,
        subject_id: data.subject_id,
        semester: data.semester
      }
    });

    let finalGradeRecord;
    if (existingFinal) {
      finalGradeRecord = await this.prisma.finalGrade.update({
        where: { id: existingFinal.id },
        data: {
          final_score: new Prisma.Decimal(finalScore),
          grade_letter: gradeLetter,
          is_passed: isPassed,
          description,
          competencies_achieved,
        }
      });
    } else {
      finalGradeRecord = await this.prisma.finalGrade.create({
        data: {
          student_id: data.student_id,
          subject_id: data.subject_id,
          semester: data.semester,
          final_score: new Prisma.Decimal(finalScore),
          grade_letter: gradeLetter,
          is_passed: isPassed,
          description,
          competencies_achieved,
          major_id: student.major_id,
          batch_id: student.batch_id,
        }
      });
    }

    // Auto-create remedial record if student failed
    if (!isPassed) {
      const existingRemedial = await this.prisma.remedial.findFirst({
        where: {
          student_id: data.student_id,
          subject_id: data.subject_id,
          status: 'active',
        }
      });
      if (!existingRemedial) {
        await this.prisma.remedial.create({
          data: {
            student_id: data.student_id,
            subject_id: data.subject_id,
            score_before: new Prisma.Decimal(finalScore),
            status: 'active',
            notes: `Nilai di bawah KKM (${subject.passing_grade}). Nilai akhir: ${finalScore.toFixed(1)}`,
          }
        });
      }
    }

    return finalGradeRecord;
  }

  async finalizeClassGrades(data: { class_id: string, subject_id: string, semester: number }) {
    const students = await this.prisma.student.findMany({
      where: { class_id: data.class_id }
    });

    if (students.length === 0) {
      throw new NotFoundException('No students found in this class');
    }

    const results: any[] = [];
    for (const student of students) {
      try {
        const result = await this.finalizeGrade({
          student_id: student.id,
          subject_id: data.subject_id,
          semester: data.semester
        });
        results.push(result);
      } catch (err) {
        // Skip students with no grades
        continue;
      }
    }

    return {
      message: `Successfully finalized ${results.length} students out of ${students.length}`,
      finalized_count: results.length
    };
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

  /**
   * Get nilai siswa untuk portal orang tua
   */
  async getParentPortalData(studentId: string) {
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
      throw new NotFoundException('Student not found');
    }

    // Group grades by semester for chart data
    const gradesBySemester: Record<number, number[]> = {};
    student.final_grades.forEach(grade => {
      if (!gradesBySemester[grade.semester]) {
        gradesBySemester[grade.semester] = [];
      }
      gradesBySemester[grade.semester].push(Number(grade.final_score));
    });

    // Calculate average per semester
    const chartData = Object.entries(gradesBySemester).map(([semester, scores]) => ({
      semester: `Semester ${semester}`,
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      semester_num: parseInt(semester)
    })).sort((a, b) => a.semester_num - b.semester_num);

    // Recent grades
    const recentGrades = student.grades.slice(0, 5).map(g => ({
      subject_name: g.subject.name,
      type: g.type,
      score: Number(g.score),
      date: g.created_at,
    }));

    // Summary
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
}
