import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicantDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  birth_place: string;

  @IsString()
  @IsNotEmpty()
  birth_date: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  previous_school: string;

  @IsString()
  @IsOptional()
  document_url?: string;

  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsString()
  @IsNotEmpty()
  major_id: string;
}
