import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ default: 'Lunez Wong' })
  @IsString()
  fullName: string;

  @ApiProperty({ default: 'abc@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'Abc123@' })
  @IsString()
  password: string;
}
