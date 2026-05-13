import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  @Public()
  create(@Body() createApplicantDto: CreateApplicantDto) {
    return this.applicantsService.create(createApplicantDto);
  }

  @Post('upload-document')
  @Public()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/applicants',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/applicants/${file.filename}`,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Bendahara')
  findAll(@Query() query: any) {
    return this.applicantsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator Utama', 'Kepala Sekolah', 'Bendahara')
  findOne(@Param('id') id: string) {
    return this.applicantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator Utama')
  update(@Param('id') id: string, @Body() data: any) {
    return this.applicantsService.update(id, data);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator Utama', 'Kepala Sekolah')
  verify(@Param('id') id: string, @Body('status') status: string) {
    return this.applicantsService.verify(id, status);
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator Utama', 'Kepala Sekolah')
  accept(@Param('id') id: string) {
    return this.applicantsService.acceptApplicant(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator Utama')
  remove(@Param('id') id: string) {
    return this.applicantsService.remove(id);
  }
}
