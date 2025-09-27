import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  amount: Number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
