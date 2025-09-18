import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  goalName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
