import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMajorDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
