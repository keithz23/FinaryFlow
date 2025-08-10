import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({default: 'abc@gmail.com'})
  @IsEmail()
  email: string;

  @ApiProperty({default: 'Abc123@'})
  @IsString()
  password: string;
}
